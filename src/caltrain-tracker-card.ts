import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

interface CaltrainCardConfig extends LovelaceCardConfig {
  type: string;
  entity?: string;
  entities?: string[]; // Multiple station entities
  name?: string;
  show_alerts?: boolean;
  max_trains?: number;
  show_station_selector?: boolean;
  use_gps?: boolean;
  gps_entity?: string; // Device tracker or person entity for GPS
  direction?: 'northbound' | 'southbound' | 'both'; // Direction filter
}

interface NextTrain {
  trip_id: string;
  route: string;
  eta_minutes: number;
  arrival_time: string;
  delay?: number; // Delay in seconds (positive = late, negative = early)
  scheduled_time?: string;
}

interface SensorAttributes {
  station_name: string;
  direction: string;
  next_trains: NextTrain[];
  alerts: any[];
  alert_count: number;
  train_count: number;
  last_update: string;
}

@customElement('caltrain-tracker-card')
export class CaltrainTrackerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CaltrainCardConfig;
  @state() private _selectedEntity?: string;
  @state() private _isRefreshing = false;

  public setConfig(config: CaltrainCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    
    // Normalize entities - handle both array and single string
    if (config.entities) {
      if (typeof config.entities === 'string') {
        // If entities is a string, convert to array
        config.entities = [config.entities];
      } else if (!Array.isArray(config.entities)) {
        // If it's not an array or string, make it an array
        config.entities = [];
      }
    }
    
    // Validate that at least one entity is provided
    if (!config.entity && (!config.entities || config.entities.length === 0)) {
      throw new Error('Please define an entity or entities');
    }
    
    this._config = config;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    // Ensure the editor element is defined
    await customElements.whenDefined('caltrain-tracker-card-editor');
    return document.createElement('caltrain-tracker-card-editor');
  }

  public static getStubConfig(): CaltrainCardConfig {
    return {
      type: 'custom:caltrain-tracker-card',
      entities: [],
      name: 'Caltrain Station',
      show_alerts: true,
      max_trains: 2,
      direction: 'both',
    };
  }

  public getCardSize(): number {
    const maxTrains = this._config.max_trains || 3;
    const showAlerts = this._config.show_alerts !== false;
    const attributes = this._getAttributes();
    const alertCount = attributes?.alert_count || 0;
    
    // Base size (header) + trains + alerts
    return 1 + maxTrains + (showAlerts && alertCount > 0 ? alertCount : 0);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }

    if (changedProps.has('_config')) {
      return true;
    }

    const currentEntity = this._getCurrentEntity();
    if (!currentEntity) {
      return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || oldHass.states[currentEntity] !== this.hass.states[currentEntity]) {
      return true;
    }

    return false;
  }

  private _getAttributes(): SensorAttributes | null {
    const currentEntity = this._getCurrentEntity();
    if (!currentEntity || !this.hass) {
      return null;
    }

    const stateObj = this.hass.states[currentEntity];
    if (!stateObj) {
      return null;
    }

    return stateObj.attributes as SensorAttributes;
  }

  private _getState(): string {
    const currentEntity = this._getCurrentEntity();
    if (!currentEntity || !this.hass) {
      return 'unknown';
    }

    const stateObj = this.hass.states[currentEntity];
    return stateObj ? stateObj.state : 'unknown';
  }

  private _formatETA(minutes: number): string {
    if (minutes < 1) {
      return 'Now';
    }
    if (minutes === 1) {
      return '1 min';
    }
    return `${minutes} mins`;
  }

  private _getETAColor(minutes: number): string {
    if (minutes < 5) return 'var(--error-color, #ff5252)';
    if (minutes < 10) return 'var(--warning-color, #ffa726)';
    return 'var(--success-color, #66bb6a)';
  }

  private _isWithinOperatingHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Caltrain operates roughly 5 AM - 1 AM (next day)
    // Weekdays: 4:00 AM - 1:00 AM
    // Weekends: 6:00 AM - 1:00 AM
    if (day >= 1 && day <= 5) {
      // Weekday
      return hour >= 4 || hour < 1;
    } else {
      // Weekend
      return hour >= 6 || hour < 1;
    }
  }

  private _calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula for distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private _getClosestStation(): string | null {
    if (!this._config.use_gps || !this._config.gps_entity || !this.hass) {
      return null;
    }

    const gpsEntity = this.hass.states[this._config.gps_entity];
    if (!gpsEntity || !gpsEntity.attributes.latitude || !gpsEntity.attributes.longitude) {
      return null;
    }

    const userLat = gpsEntity.attributes.latitude;
    const userLon = gpsEntity.attributes.longitude;
    
    const entities = this._config.entities || (this._config.entity ? [this._config.entity] : []);
    let closestEntity = null;
    let closestDistance = Infinity;

    entities.forEach(entityId => {
      const stateObj = this.hass.states[entityId];
      if (stateObj && stateObj.attributes.latitude && stateObj.attributes.longitude) {
        const distance = this._calculateDistance(
          userLat,
          userLon,
          stateObj.attributes.latitude,
          stateObj.attributes.longitude
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEntity = entityId;
        }
      }
    });

    return closestEntity;
  }

  private _getCurrentEntity(): string | null {
    // Priority: selected entity > GPS closest > config entity > first in entities list
    if (this._selectedEntity) {
      return this._selectedEntity;
    }

    if (this._config.use_gps) {
      const closest = this._getClosestStation();
      if (closest) {
        return closest;
      }
    }

    if (this._config.entity) {
      return this._config.entity;
    }

    if (this._config.entities && this._config.entities.length > 0) {
      return this._config.entities[0];
    }

    return null;
  }

  private async _handleRefresh(): Promise<void> {
    if (!this._isWithinOperatingHours()) {
      alert('Caltrain is not currently operating. Service hours: Weekdays 4 AM - 1 AM, Weekends 6 AM - 1 AM');
      return;
    }

    this._isRefreshing = true;
    
    const entity = this._getCurrentEntity();
    if (entity && this.hass) {
      // Trigger a coordinator refresh by calling the update service
      try {
        await this.hass.callService('homeassistant', 'update_entity', {
          entity_id: entity,
        });
        
        // Wait a moment for the update to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error refreshing entity:', error);
      }
    }
    
    this._isRefreshing = false;
  }

  private _handleStationSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this._selectedEntity = target.value;
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const currentEntity = this._getCurrentEntity();
    if (!currentEntity) {
      return html`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Please configure an entity or entities</p>
          </div>
        </ha-card>
      `;
    }

    const stateObj = this.hass.states[currentEntity];
    if (!stateObj) {
      return html`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Entity not found: ${currentEntity}</p>
          </div>
        </ha-card>
      `;
    }

    const attributes = this._getAttributes();
    if (!attributes) {
      return html`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>No data available</p>
          </div>
        </ha-card>
      `;
    }

    const maxTrains = this._config.max_trains || 3;
    const showAlerts = this._config.show_alerts !== false;
    const nextTrains = attributes.next_trains?.slice(0, maxTrains) || [];
    const state = this._getState();

    const availableEntities = this._config.entities || (this._config.entity ? [this._config.entity] : []);
    // Show station selector if: explicitly enabled, OR multiple entities exist (auto-show)
    const showStationSelector = availableEntities.length > 1 && 
      (this._config.show_station_selector !== false);

    return html`
      <ha-card>
        <div class="card-header">
          <div class="header-content">
            <ha-icon icon="mdi:train"></ha-icon>
            <div class="header-text">
              <div class="name">
                ${this._config.name || attributes.station_name}
                ${this._config.use_gps && this._getClosestStation() === currentEntity
                  ? html`<ha-icon class="gps-indicator" icon="mdi:crosshairs-gps" title="Auto-selected by GPS"></ha-icon>`
                  : ''}
              </div>
              <div class="direction">${attributes.direction}</div>
            </div>
          </div>
          <div class="header-actions">
            ${showStationSelector
              ? html`
                  <select class="station-selector" @change=${this._handleStationSelect}>
                    ${availableEntities.map(
                      (entityId) => {
                        const entity = this.hass.states[entityId];
                        const label = entity 
                          ? `${entity.attributes.station_name} ${entity.attributes.direction}`
                          : entityId;
                        return html`
                          <option value="${entityId}" ?selected=${entityId === currentEntity}>
                            ${label}
                          </option>
                        `;
                      }
                    )}
                  </select>
                `
              : ''}
            <button 
              class="refresh-button" 
              @click=${this._handleRefresh}
              ?disabled=${this._isRefreshing || !this._isWithinOperatingHours()}
              title="Refresh train data"
            >
              <ha-icon icon="${this._isRefreshing ? 'mdi:loading' : 'mdi:refresh'}"></ha-icon>
            </button>
            ${attributes.train_count > 0
              ? html`<div class="train-count">${attributes.train_count} trains</div>`
              : ''}
          </div>
        </div>

        <div class="card-content">
          ${state === 'No trains'
            ? html`
                <div class="no-trains">
                  <ha-icon icon="mdi:train-variant"></ha-icon>
                  <p>No upcoming trains</p>
                </div>
              `
            : nextTrains.length > 0
            ? html`
                <div class="trains">
                  ${nextTrains.map(
                    (train) => {
                      // Check if train has delay information
                      const delay = train.delay || 0;
                      const isDelayed = delay > 60; // More than 1 minute late
                      const isEarly = delay < -60; // More than 1 minute early
                      const hasScheduledTime = train.scheduled_time && train.scheduled_time !== train.arrival_time;
                      
                      return html`
                        <div class="train-item ${isDelayed ? 'delayed' : ''}">
                          <div class="train-route">
                            <ha-icon icon="mdi:train-car"></ha-icon>
                            <span>${train.route}</span>
                            ${train.trip_id ? html`<span class="trip-id">#${train.trip_id}</span>` : ''}
                          </div>
                          <div class="train-info">
                            <div class="train-time">
                              ${hasScheduledTime
                                ? html`
                                    <span class="scheduled-time" title="Scheduled arrival">
                                      ${train.scheduled_time}
                                    </span>
                                    <ha-icon class="arrow-icon" icon="mdi:arrow-right"></ha-icon>
                                    <span class="realtime-badge" title="Real-time arrival">
                                      ${train.arrival_time}
                                    </span>
                                  `
                                : html`${train.arrival_time}`}
                              ${isDelayed
                                ? html`<span class="delay-badge late">+${Math.round(delay / 60)}min</span>`
                                : isEarly
                                ? html`<span class="delay-badge early">${Math.round(delay / 60)}min</span>`
                                : ''}
                            </div>
                            <div 
                              class="train-eta" 
                              style="color: ${this._getETAColor(train.eta_minutes)}"
                            >
                              ${this._formatETA(train.eta_minutes)}
                            </div>
                          </div>
                        </div>
                      `;
                    }
                  )}
                </div>
              `
            : html`
                <div class="no-trains">
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <p>Loading trains...</p>
                </div>
              `}

          ${showAlerts && attributes.alerts && attributes.alerts.length > 0
            ? html`
                <div class="alerts">
                  <div class="alerts-header">
                    <ha-icon icon="mdi:alert"></ha-icon>
                    <span>Service Alerts</span>
                  </div>
                  ${attributes.alerts.map(
                    (alert) => html`
                      <div class="alert-item">
                        <div class="alert-title">${alert.header || 'Service Alert'}</div>
                        ${alert.description
                          ? html`<div class="alert-description">${alert.description}</div>`
                          : ''}
                      </div>
                    `
                  )}
                </div>
              `
            : ''}
        </div>

        ${attributes.last_update
          ? html`
              <div class="card-footer">
                <span class="last-update">Updated: ${attributes.last_update}</span>
              </div>
            `
          : ''}
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
        --ha-card-border-radius: 12px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
        gap: 12px;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .header-content ha-icon {
        color: var(--primary-color);
        --mdc-icon-size: 32px;
      }

      .header-text {
        display: flex;
        flex-direction: column;
      }

      .name {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .gps-indicator {
        color: var(--success-color, #66bb6a);
        --mdc-icon-size: 18px;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .direction {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .train-count {
        background: var(--primary-color);
        color: var(--text-primary-color);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }

      .station-selector {
        padding: 6px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        max-width: 200px;
      }

      .station-selector:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .refresh-button {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .refresh-button:hover:not(:disabled) {
        background: var(--primary-color);
        color: var(--text-primary-color);
        border-color: var(--primary-color);
      }

      .refresh-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .refresh-button ha-icon {
        --mdc-icon-size: 20px;
      }

      .refresh-button:disabled ha-icon {
        animation: none;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .refresh-button ha-icon[icon="mdi:loading"] {
        animation: spin 1s linear infinite;
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .trains {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .train-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .train-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .train-item.delayed {
        border-color: var(--error-color, #ff5252);
        background: rgba(255, 82, 82, 0.05);
      }

      .train-route {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: var(--primary-text-color);
        flex-wrap: wrap;
      }

      .trip-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-weight: 400;
      }

      .train-route ha-icon {
        color: var(--primary-color);
        --mdc-icon-size: 20px;
      }

      .train-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }

      .train-time {
        font-size: 14px;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .scheduled-time {
        text-decoration: line-through;
        opacity: 0.6;
      }

      .realtime-badge {
        font-weight: 600;
        color: var(--primary-color);
      }

      .arrow-icon {
        --mdc-icon-size: 14px;
        opacity: 0.6;
      }

      .train-eta {
        font-size: 16px;
        font-weight: 600;
      }

      .delay-badge {
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
        white-space: nowrap;
      }

      .delay-badge.late {
        background: var(--error-color, #ff5252);
        color: white;
      }

      .delay-badge.early {
        background: var(--success-color, #66bb6a);
        color: white;
      }

      .no-trains {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .no-trains ha-icon {
        --mdc-icon-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
      }

      .alerts {
        margin-top: 8px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
      }

      .alerts-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 600;
        color: var(--warning-color, #ffa726);
      }

      .alerts-header ha-icon {
        --mdc-icon-size: 20px;
      }

      .alert-item {
        padding: 12px;
        background: var(--warning-color, #ffa726);
        background: rgba(255, 167, 38, 0.1);
        border-left: 3px solid var(--warning-color, #ffa726);
        border-radius: 4px;
        margin-bottom: 8px;
      }

      .alert-title {
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .alert-description {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .card-footer {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
        text-align: center;
      }

      .last-update {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--error-color, #ff5252);
        text-align: center;
      }

      .error ha-icon {
        --mdc-icon-size: 48px;
        margin-bottom: 12px;
      }
    `;
  }
}

// Visual Editor
@customElement('caltrain-tracker-card-editor')
export class CaltrainTrackerCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CaltrainCardConfig;

  public setConfig(config: CaltrainCardConfig): void {
    this._config = { ...config };
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const value = target.value;

    if (target.configValue) {
      const newConfig = {
        ...this._config,
        [target.configValue]: target.checked !== undefined ? target.checked : value,
      };

      const event = new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  private _entityCheckboxChanged(ev: Event, entityId: string): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as HTMLInputElement;
    const currentEntities = this._config.entities || [];
    
    let newEntities: string[];
    if (target.checked) {
      // Add entity if not already present
      newEntities = currentEntities.includes(entityId) 
        ? currentEntities 
        : [...currentEntities, entityId];
    } else {
      // Remove entity
      newEntities = currentEntities.filter(e => e !== entityId);
    }

    const newConfig = {
      ...this._config,
      entities: newEntities.length > 0 ? newEntities : [],
    };

    // If we have entities, remove single entity
    if (newEntities.length > 0) {
      delete newConfig.entity;
    }

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  protected render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    // Get all Caltrain entities
    const allCaltrainEntities = Object.keys(this.hass.states).filter(
      (eid) => eid.startsWith('sensor.') && (eid.includes('caltrain') || eid.includes('northbound') || eid.includes('southbound'))
    );

    // Group by station name
    const stationGroups: { [key: string]: { northbound?: string; southbound?: string } } = {};
    allCaltrainEntities.forEach(entityId => {
      const entity = this.hass.states[entityId];
      const stationName = entity.attributes.station_name || entityId;
      const direction = entity.attributes.direction?.toLowerCase() || '';
      
      if (!stationGroups[stationName]) {
        stationGroups[stationName] = {};
      }
      
      if (direction.includes('north')) {
        stationGroups[stationName].northbound = entityId;
      } else if (direction.includes('south')) {
        stationGroups[stationName].southbound = entityId;
      }
    });

    // Filter entities based on selected direction
    const selectedDirection = this._config.direction || 'both';
    const filteredEntities = allCaltrainEntities.filter(entityId => {
      if (selectedDirection === 'both') return true;
      const entity = this.hass.states[entityId];
      const direction = entity.attributes.direction?.toLowerCase() || '';
      return direction.includes(selectedDirection);
    });

    const selectedEntities = this._config.entities || [];

    return html`
      <div class="card-config">
        <div class="option">
          <label class="label">Direction Filter</label>
          <select
            .configValue=${'direction'}
            .value=${this._config.direction || 'both'}
            @change=${this._valueChanged}
          >
            <option value="both">Both Directions</option>
            <option value="northbound">Northbound Only</option>
            <option value="southbound">Southbound Only</option>
          </select>
          <div class="description">Filter stations by direction</div>
        </div>

        <div class="option">
          <label class="label">Select Stations</label>
          <div class="station-checkboxes">
            ${filteredEntities.length === 0
              ? html`<div class="no-stations">No Caltrain stations found</div>`
              : filteredEntities.map(entityId => {
                  const entity = this.hass.states[entityId];
                  const stationName = entity.attributes.station_name || entityId;
                  const direction = entity.attributes.direction || '';
                  return html`
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        .checked=${selectedEntities.includes(entityId)}
                        @change=${(ev: Event) => this._entityCheckboxChanged(ev, entityId)}
                      />
                      <span>${stationName} - ${direction}</span>
                    </label>
                  `;
                })}
          </div>
          <div class="description">
            Select one or more stations to display. Multiple stations enable GPS proximity and station selector.
          </div>
        </div>

        <div class="option">
          <label class="label">Card Name (optional)</label>
          <input
            type="text"
            .configValue=${'name'}
            .value=${this._config.name || ''}
            @input=${this._valueChanged}
            placeholder="Caltrain Station"
          />
          <div class="description">Custom title for the card</div>
        </div>

        <div class="option">
          <label class="label">Maximum Trains</label>
          <input
            type="number"
            .configValue=${'max_trains'}
            .value=${this._config.max_trains || 2}
            @input=${this._valueChanged}
            min="1"
            max="10"
          />
          <div class="description">Number of upcoming trains to display (1-10)</div>
        </div>

        <div class="option">
          <label class="label">
            <input
              type="checkbox"
              .configValue=${'show_alerts'}
              .checked=${this._config.show_alerts !== false}
              @change=${this._valueChanged}
            />
            Show Service Alerts
          </label>
          <div class="description">Display active service alerts and delays</div>
        </div>

        <div class="option">
          <label class="label">
            <input
              type="checkbox"
              .configValue=${'show_station_selector'}
              .checked=${this._config.show_station_selector !== false}
              @change=${this._valueChanged}
            />
            Show Station Selector
          </label>
          <div class="description">
            Display dropdown to switch stations (auto-enabled with multiple entities)
          </div>
        </div>

        <div class="option">
          <label class="label">
            <input
              type="checkbox"
              .configValue=${'use_gps'}
              .checked=${this._config.use_gps === true}
              @change=${this._valueChanged}
            />
            Use GPS Proximity
          </label>
          <div class="description">Auto-select nearest station based on GPS location</div>
        </div>

        ${this._config.use_gps
          ? html`
              <div class="option">
                <label class="label">GPS Entity</label>
                <select
                  .configValue=${'gps_entity'}
                  .value=${this._config.gps_entity || ''}
                  @change=${this._valueChanged}
                >
                  <option value="">Select GPS Entity</option>
                  ${Object.keys(this.hass.states)
                    .filter(
                      (eid) =>
                        eid.startsWith('device_tracker.') || eid.startsWith('person.')
                    )
                    .map(
                      (entity) => html`
                        <option value="${entity}" ?selected=${entity === this._config.gps_entity}>
                          ${this.hass.states[entity].attributes.friendly_name || entity}
                        </option>
                      `
                    )}
                </select>
                <div class="description">Device tracker or person entity for location</div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px 0;
      }

      .option {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .description {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      input[type='text'],
      input[type='number'],
      select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        font-family: inherit;
      }

      input[type='text']:focus,
      input[type='number']:focus,
      select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      input[type='checkbox'] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      input[type='number'] {
        width: 100px;
      }

      select {
        cursor: pointer;
      }

      .station-checkboxes {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .checkbox-label:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
        opacity: 0.1;
      }

      .checkbox-label span {
        font-size: 14px;
      }

      .no-stations {
        padding: 16px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 14px;
      }
    `;
  }
}

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'caltrain-tracker-card',
  name: 'Caltrain Tracker Card',
  description: 'Display real-time Caltrain arrivals and service alerts',
});

console.info(
  '%c CALTRAIN-TRACKER-CARD %c 1.3.0 ',
  'color: white; background: #009688; font-weight: 700;',
  'color: #009688; background: white; font-weight: 700;'
);
