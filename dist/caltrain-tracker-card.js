function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,_=g?g.emptyScript:"",$=f.reactiveElementPolyfillSupport,m=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??y)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[m("elementProperties")]=new Map,x[m("finalized")]=new Map,$?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,E=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,M=`<${P}>`,O=document,U=()=>O.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,T="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,z=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),V=new WeakMap,K=O.createTreeWalker(O,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=H;for(let a=0;a<i;a++){const e=t[a];let i,c,l=-1,h=0;for(;h<e.length&&(o.lastIndex=h,c=o.exec(e),null!==c);)h=o.lastIndex,o===H?"!--"===c[1]?o=N:void 0!==c[1]?o=z:void 0!==c[2]?(L.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=j):void 0!==c[3]&&(o=j):o===j?">"===c[0]?(o=r??H,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,i=c[1],o=void 0===c[3]?j:'"'===c[3]?I:D):o===I||o===D?o=j:o===N||o===z?o=H:(o=j,r=void 0);const d=o===j&&t[a+1].startsWith("/>")?" ":"";n+=o===H?e+M:l>=0?(s.push(i),e.slice(0,l)+S+e.slice(l)+C+d):e+C+(-2===l?a:d)}return[J(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[c,l]=Z(t,e);if(this.el=F.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[n++],i=s.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:X}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),K.nextNode(),a.push({type:2,index:++r});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===B)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=k(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=K.nextNode(),n++)}return K.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),k(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=F.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new F(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Q(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Y(this,t,e,0),n=!k(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Y(this,s[i+o],e,o),a===B&&(a=this._$AH[o]),n||=!k(a)||a!==this._$AH[o],a===q?t=q:t!==q&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends X{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??q)===B)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(F,Q),(A.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Q(e.insertBefore(U(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ot._$litElement$=!0,ot.finalized=!0,nt.litElementHydrateSupport?.({LitElement:ot});const at=nt.litElementPolyfillSupport;at?.({LitElement:ot}),(nt.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},lt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return(e,i)=>"object"==typeof i?lt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t){return ht({...t,state:!0,attribute:!1})}let pt=class extends ot{constructor(){super(...arguments),this._isRefreshing=!1}setConfig(t){if(!t)throw new Error("Invalid configuration");if(!(t.entity||t.entities&&0!==t.entities.length))throw new Error("Please define an entity or entities");this._config=t}getCardSize(){const t=this._config.max_trains||3,e=!1!==this._config.show_alerts,i=this._getAttributes(),s=i?.alert_count||0;return 1+t+(e&&s>0?s:0)}shouldUpdate(t){if(!this._config)return!1;if(t.has("_config"))return!0;const e=this._getCurrentEntity();if(!e)return!0;const i=t.get("hass");return!i||i.states[e]!==this.hass.states[e]}_getAttributes(){const t=this._getCurrentEntity();if(!t||!this.hass)return null;const e=this.hass.states[t];return e?e.attributes:null}_getState(){const t=this._getCurrentEntity();if(!t||!this.hass)return"unknown";const e=this.hass.states[t];return e?e.state:"unknown"}_formatETA(t){return t<1?"Now":1===t?"1 min":`${t} mins`}_getETAColor(t){return t<5?"var(--error-color, #ff5252)":t<10?"var(--warning-color, #ffa726)":"var(--success-color, #66bb6a)"}_isWithinOperatingHours(){const t=new Date,e=t.getHours(),i=t.getDay();return i>=1&&i<=5?e>=4||e<1:e>=6||e<1}_calculateDistance(t,e,i,s){const r=(i-t)*Math.PI/180,n=(s-e)*Math.PI/180,o=Math.sin(r/2)*Math.sin(r/2)+Math.cos(t*Math.PI/180)*Math.cos(i*Math.PI/180)*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))}_getClosestStation(){if(!this._config.use_gps||!this._config.gps_entity||!this.hass)return null;const t=this.hass.states[this._config.gps_entity];if(!t||!t.attributes.latitude||!t.attributes.longitude)return null;const e=t.attributes.latitude,i=t.attributes.longitude,s=this._config.entities||(this._config.entity?[this._config.entity]:[]);let r=null,n=1/0;return s.forEach(t=>{const s=this.hass.states[t];if(s&&s.attributes.latitude&&s.attributes.longitude){const o=this._calculateDistance(e,i,s.attributes.latitude,s.attributes.longitude);o<n&&(n=o,r=t)}}),r}_getCurrentEntity(){if(this._selectedEntity)return this._selectedEntity;if(this._config.use_gps){const t=this._getClosestStation();if(t)return t}return this._config.entity?this._config.entity:this._config.entities&&this._config.entities.length>0?this._config.entities[0]:null}async _handleRefresh(){if(!this._isWithinOperatingHours())return void alert("Caltrain is not currently operating. Service hours: Weekdays 4 AM - 1 AM, Weekends 6 AM - 1 AM");this._isRefreshing=!0;const t=this._getCurrentEntity();if(t&&this.hass)try{await this.hass.callService("homeassistant","update_entity",{entity_id:t}),await new Promise(t=>setTimeout(t,1e3))}catch(e){console.error("Error refreshing entity:",e)}this._isRefreshing=!1}_handleStationSelect(t){const e=t.target;this._selectedEntity=e.value}render(){if(!this._config||!this.hass)return W``;const t=this._getCurrentEntity();if(!t)return W`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Please configure an entity or entities</p>
          </div>
        </ha-card>
      `;if(!this.hass.states[t])return W`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Entity not found: ${t}</p>
          </div>
        </ha-card>
      `;const e=this._getAttributes();if(!e)return W`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>No data available</p>
          </div>
        </ha-card>
      `;const i=this._config.max_trains||3,s=!1!==this._config.show_alerts,r=e.next_trains?.slice(0,i)||[],n=this._getState(),o=this._config.entities||(this._config.entity?[this._config.entity]:[]),a=o.length>1&&!1!==this._config.show_station_selector;return W`
      <ha-card>
        <div class="card-header">
          <div class="header-content">
            <ha-icon icon="mdi:train"></ha-icon>
            <div class="header-text">
              <div class="name">${this._config.name||e.station_name}</div>
              <div class="direction">${e.direction}</div>
            </div>
          </div>
          <div class="header-actions">
            ${a?W`
                  <select class="station-selector" @change=${this._handleStationSelect}>
                    ${o.map(e=>{const i=this.hass.states[e],s=i?`${i.attributes.station_name} ${i.attributes.direction}`:e;return W`
                          <option value="${e}" ?selected=${e===t}>
                            ${s}
                          </option>
                        `})}
                  </select>
                `:""}
            <button 
              class="refresh-button" 
              @click=${this._handleRefresh}
              ?disabled=${this._isRefreshing||!this._isWithinOperatingHours()}
              title="Refresh train data"
            >
              <ha-icon icon="${this._isRefreshing?"mdi:loading":"mdi:refresh"}"></ha-icon>
            </button>
            ${e.train_count>0?W`<div class="train-count">${e.train_count} trains</div>`:""}
          </div>
        </div>

        <div class="card-content">
          ${"No trains"===n?W`
                <div class="no-trains">
                  <ha-icon icon="mdi:train-variant"></ha-icon>
                  <p>No upcoming trains</p>
                </div>
              `:r.length>0?W`
                <div class="trains">
                  ${r.map(t=>{const e=t.delay||0,i=e>60,s=e<-60;return W`
                        <div class="train-item ${i?"delayed":""}">
                          <div class="train-route">
                            <ha-icon icon="mdi:train-car"></ha-icon>
                            <span>${t.route}</span>
                            ${t.trip_id?W`<span class="trip-id">#${t.trip_id}</span>`:""}
                          </div>
                          <div class="train-info">
                            <div class="train-time">
                              ${t.arrival_time}
                              ${i?W`<span class="delay-badge late">+${Math.round(e/60)}min</span>`:s?W`<span class="delay-badge early">${Math.round(e/60)}min</span>`:""}
                            </div>
                            <div 
                              class="train-eta" 
                              style="color: ${this._getETAColor(t.eta_minutes)}"
                            >
                              ${this._formatETA(t.eta_minutes)}
                            </div>
                          </div>
                        </div>
                      `})}
                </div>
              `:W`
                <div class="no-trains">
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <p>Loading trains...</p>
                </div>
              `}

          ${s&&e.alerts&&e.alerts.length>0?W`
                <div class="alerts">
                  <div class="alerts-header">
                    <ha-icon icon="mdi:alert"></ha-icon>
                    <span>Service Alerts</span>
                  </div>
                  ${e.alerts.map(t=>W`
                      <div class="alert-item">
                        <div class="alert-title">${t.header||"Service Alert"}</div>
                        ${t.description?W`<div class="alert-description">${t.description}</div>`:""}
                      </div>
                    `)}
                </div>
              `:""}
        </div>

        ${e.last_update?W`
              <div class="card-footer">
                <span class="last-update">Updated: ${e.last_update}</span>
              </div>
            `:""}
      </ha-card>
    `}static get styles(){return o`
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
    `}};t([ht({attribute:!1})],pt.prototype,"hass",void 0),t([dt()],pt.prototype,"_config",void 0),t([dt()],pt.prototype,"_selectedEntity",void 0),t([dt()],pt.prototype,"_isRefreshing",void 0),pt=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("caltrain-tracker-card")],pt),window.customCards=window.customCards||[],window.customCards.push({type:"caltrain-tracker-card",name:"Caltrain Tracker Card",description:"Display real-time Caltrain arrivals and service alerts"}),console.info("%c CALTRAIN-TRACKER-CARD %c 1.0.0 ","color: white; background: #009688; font-weight: 700;","color: #009688; background: white; font-weight: 700;");export{pt as CaltrainTrackerCard};
//# sourceMappingURL=caltrain-tracker-card.js.map
