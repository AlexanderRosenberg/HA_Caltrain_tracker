import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';

interface CaltrainCardConfig extends LovelaceCardConfig {
  type: string;
  entity?: string;
  name?: string;
  show_alerts?: boolean;
  max_trains?: number;
}

interface NextTrain {
  trip_id: string;
  route: string;
  eta_minutes: number;
  arrival_time: string;
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

  public setConfig(config: CaltrainCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
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

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || oldHass.states[this._config.entity!] !== this.hass.states[this._config.entity!]) {
      return true;
    }

    return false;
  }

  private _getAttributes(): SensorAttributes | null {
    if (!this._config.entity || !this.hass) {
      return null;
    }

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return null;
    }

    return stateObj.attributes as SensorAttributes;
  }

  private _getState(): string | null {
    if (!this._config.entity || !this.hass) {
      return null;
    }

    const stateObj = this.hass.states[this._config.entity];
    return stateObj ? stateObj.state : null;
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

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    if (!this._config.entity) {
      return html`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Please configure an entity</p>
          </div>
        </ha-card>
      `;
    }

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Entity not found: ${this._config.entity}</p>
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

    return html`
      <ha-card>
        <div class="card-header">
          <div class="header-content">
            <ha-icon icon="mdi:train"></ha-icon>
            <div class="header-text">
              <div class="name">${this._config.name || attributes.station_name}</div>
              <div class="direction">${attributes.direction}</div>
            </div>
          </div>
          ${attributes.train_count > 0
            ? html`<div class="train-count">${attributes.train_count} trains</div>`
            : ''}
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
                    (train) => html`
                      <div class="train-item">
                        <div class="train-route">
                          <ha-icon icon="mdi:train-car"></ha-icon>
                          <span>${train.route}</span>
                        </div>
                        <div class="train-info">
                          <div class="train-time">${train.arrival_time}</div>
                          <div 
                            class="train-eta" 
                            style="color: ${this._getETAColor(train.eta_minutes)}"
                          >
                            ${this._formatETA(train.eta_minutes)}
                          </div>
                        </div>
                      </div>
                    `
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
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
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

      .train-route {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: var(--primary-text-color);
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
      }

      .train-eta {
        font-size: 16px;
        font-weight: 600;
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

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'caltrain-tracker-card',
  name: 'Caltrain Tracker Card',
  description: 'Display real-time Caltrain arrivals and service alerts',
});

console.info(
  '%c CALTRAIN-TRACKER-CARD %c 1.0.0 ',
  'color: white; background: #009688; font-weight: 700;',
  'color: #009688; background: white; font-weight: 700;'
);
