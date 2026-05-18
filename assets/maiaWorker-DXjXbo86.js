var e=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")}),t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.prototype.hasOwnProperty,a=(t=>typeof e<`u`?e:typeof Proxy<`u`?new Proxy(t,{get:(t,n)=>(typeof e<`u`?e:t)[n]}):t)(function(t){
/*!
* ONNX Runtime Web v1.26.0
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
if(typeof e<`u`)return e.apply(this,arguments);throw Error(`Dynamic require of "`+t+`" is not supported`)}),o=(e,t)=>()=>(e&&(t=e(e=0)),t),s=(e,n)=>{for(var r in n)t(e,r,{get:n[r],enumerable:!0})},c=(e,a,o,s)=>{if(a&&typeof a==`object`||typeof a==`function`)for(let c of r(a))!i.call(e,c)&&c!==o&&t(e,c,{get:()=>a[c],enumerable:!(s=n(a,c))||s.enumerable});return e},l=e=>c(t({},`__esModule`,{value:!0}),e),u,d,f,p,m,h=o(()=>{u=new Map,d=[],f=(e,t,n)=>{if(t&&typeof t.init==`function`&&typeof t.createInferenceSessionHandler==`function`){let r=u.get(e);if(r===void 0)u.set(e,{backend:t,priority:n});else{if(r.priority>n)return;if(r.priority===n&&r.backend!==t)throw Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let t=d.indexOf(e);t!==-1&&d.splice(t,1);for(let t=0;t<d.length;t++)if(u.get(d[t]).priority<=n){d.splice(t,0,e);return}d.push(e)}return}throw TypeError(`not a valid backend`)},p=async e=>{let t=u.get(e);if(!t)return`backend not found.`;if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{return n||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(e){return n||(t.error=`${e}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},m=async e=>{let t=e.executionProviders||[],n=t.map(e=>typeof e==`string`?e:e.name),r=n.length===0?d:n,i,a=[],o=new Set;for(let e of r){let t=await p(e);typeof t==`string`?a.push({name:e,err:t}):(i||=t,i===t&&o.add(e))}if(!i)throw Error(`no available backend found. ERR: ${a.map(e=>`[${e.name}] ${e.err}`).join(`, `)}`);for(let{name:e,err:t}of a)n.includes(e)&&console.warn(`removing requested execution provider "${e}" from session options because it is not available: ${t}`);let s=t.filter(e=>o.has(typeof e==`string`?e:e.name));return[i,new Proxy(e,{get:(e,t)=>t===`executionProviders`?s:Reflect.get(e,t)})]}}),g=o(()=>{h()}),_,v=o(()=>{_=`1.26.0`}),y,b,x=o(()=>{v(),y=`warning`,b={wasm:{},webgl:{},webgpu:{},versions:{common:_},set logLevel(e){if(e!==void 0){if(typeof e!=`string`||[`verbose`,`info`,`warning`,`error`,`fatal`].indexOf(e)===-1)throw Error(`Unsupported logging level: ${e}`);y=e}},get logLevel(){return y}},Object.defineProperty(b,`logLevel`,{enumerable:!0})}),S,C=o(()=>{x(),S=b}),w,ee,T=o(()=>{w=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let r=n.getContext(`2d`);if(r!=null){let i,a;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[3]):(i=e.dims[3],a=e.dims[2]);let o=t?.format===void 0?`RGB`:t.format,s=t?.norm,c,l;s===void 0||s.mean===void 0?c=[255,255,255,255]:typeof s.mean==`number`?c=[s.mean,s.mean,s.mean,s.mean]:(c=[s.mean[0],s.mean[1],s.mean[2],0],s.mean[3]!==void 0&&(c[3]=s.mean[3])),s===void 0||s.bias===void 0?l=[0,0,0,0]:typeof s.bias==`number`?l=[s.bias,s.bias,s.bias,s.bias]:(l=[s.bias[0],s.bias[1],s.bias[2],0],s.bias[3]!==void 0&&(l[3]=s.bias[3]));let u=a*i,d=0,f=u,p=u*2,m=-1;o===`RGBA`?(d=0,f=u,p=u*2,m=u*3):o===`RGB`?(d=0,f=u,p=u*2):o===`RBG`&&(d=0,p=u,f=u*2);for(let t=0;t<a;t++)for(let n=0;n<i;n++){let i=(e.data[d++]-l[0])*c[0],a=(e.data[f++]-l[1])*c[1],o=(e.data[p++]-l[2])*c[2],s=m===-1?255:(e.data[m++]-l[3])*c[3];r.fillStyle=`rgba(`+i+`,`+a+`,`+o+`,`+s+`)`,r.fillRect(n,t,1,1)}if(`toDataURL`in n)return n.toDataURL();throw Error(`toDataURL is not supported`)}else throw Error(`Can not access image data`)},ee=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`).getContext(`2d`):new OffscreenCanvas(1,1).getContext(`2d`),r;if(n!=null){let i,a,o;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[1],o=e.dims[3]):(i=e.dims[3],a=e.dims[2],o=e.dims[1]);let s=t!==void 0&&t.format!==void 0?t.format:`RGB`,c=t?.norm,l,u;c===void 0||c.mean===void 0?l=[255,255,255,255]:typeof c.mean==`number`?l=[c.mean,c.mean,c.mean,c.mean]:(l=[c.mean[0],c.mean[1],c.mean[2],255],c.mean[3]!==void 0&&(l[3]=c.mean[3])),c===void 0||c.bias===void 0?u=[0,0,0,0]:typeof c.bias==`number`?u=[c.bias,c.bias,c.bias,c.bias]:(u=[c.bias[0],c.bias[1],c.bias[2],0],c.bias[3]!==void 0&&(u[3]=c.bias[3]));let d=a*i;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!==`RGBA`||o===3&&t.format!==`RGB`&&t.format!==`BGR`))throw Error(`Tensor format doesn't match input tensor dims`);let f=0,p=1,m=2,h=3,g=0,_=d,v=d*2,y=-1;s===`RGBA`?(g=0,_=d,v=d*2,y=d*3):s===`RGB`?(g=0,_=d,v=d*2):s===`RBG`&&(g=0,v=d,_=d*2),r=n.createImageData(i,a);for(let t=0;t<a*i;f+=4,p+=4,m+=4,h+=4,t++)r.data[f]=(e.data[g++]-u[0])*l[0],r.data[p]=(e.data[_++]-u[1])*l[1],r.data[m]=(e.data[v++]-u[2])*l[2],r.data[h]=y===-1?255:(e.data[y++]-u[3])*l[3]}else throw Error(`Can not access image data`);return r}}),E,te,ne,D,O,re,ie=o(()=>{me(),E=(e,t)=>{if(e===void 0)throw Error(`Image buffer must be defined`);if(t.height===void 0||t.width===void 0)throw Error(`Image height and width must be defined`);if(t.tensorLayout===`NHWC`)throw Error(`NHWC Tensor layout is not supported yet`);let{height:n,width:r}=t,i=t.norm??{mean:255,bias:0},a,o;a=typeof i.mean==`number`?[i.mean,i.mean,i.mean,i.mean]:[i.mean[0],i.mean[1],i.mean[2],i.mean[3]??255],o=typeof i.bias==`number`?[i.bias,i.bias,i.bias,i.bias]:[i.bias[0],i.bias[1],i.bias[2],i.bias[3]??0];let s=t.format===void 0?`RGBA`:t.format,c=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:`RGB`,l=n*r,u=c===`RGBA`?new Float32Array(l*4):new Float32Array(l*3),d=4,f=0,p=1,m=2,h=3,g=0,_=l,v=l*2,y=-1;s===`RGB`&&(d=3,f=0,p=1,m=2,h=-1),c===`RGBA`?y=l*3:c===`RBG`?(g=0,v=l,_=l*2):c===`BGR`&&(v=0,_=l,g=l*2);for(let t=0;t<l;t++,f+=d,m+=d,p+=d,h+=d)u[g++]=(e[f]+o[0])/a[0],u[_++]=(e[p]+o[1])/a[1],u[v++]=(e[m]+o[2])/a[2],y!==-1&&h!==-1&&(u[y++]=(e[h]+o[3])/a[3]);return c===`RGBA`?new pe(`float32`,u,[1,4,n,r]):new pe(`float32`,u,[1,3,n,r])},te=async(e,t)=>{let n=typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement,r=typeof ImageData<`u`&&e instanceof ImageData,i=typeof ImageBitmap<`u`&&e instanceof ImageBitmap,a=typeof e==`string`,o,s=t??{},c=()=>{if(typeof document<`u`)return document.createElement(`canvas`);if(typeof OffscreenCanvas<`u`)return new OffscreenCanvas(1,1);throw Error(`Canvas is not supported`)},l=e=>typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||e instanceof OffscreenCanvas?e.getContext(`2d`):null;if(n){let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let n=e.height,i=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(n=t.resizedHeight,i=t.resizedWidth),t!==void 0){if(s=t,t.tensorFormat!==void 0)throw Error(`Image input config format must be RGBA for HTMLImageElement`);s.tensorFormat=`RGBA`,s.height=n,s.width=i}else s.tensorFormat=`RGBA`,s.height=n,s.width=i;r.drawImage(e,0,0),o=r.getImageData(0,0,i,n).data}else throw Error(`Can not access image data`)}else if(r){let n,r;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(n=t.resizedHeight,r=t.resizedWidth):(n=e.height,r=e.width),t!==void 0&&(s=t),s.format=`RGBA`,s.height=n,s.width=r,t!==void 0){let t=c();t.width=r,t.height=n;let i=l(t);if(i!=null)i.putImageData(e,0,0),o=i.getImageData(0,0,r,n).data;else throw Error(`Can not access image data`)}else o=e.data}else if(i){if(t===void 0)throw Error(`Please provide image config with format for Imagebitmap`);let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let t=e.height,n=e.width;return r.drawImage(e,0,0,n,t),o=r.getImageData(0,0,n,t).data,s.height=t,s.width=n,E(o,s)}else throw Error(`Can not access image data`)}else{if(a)return new Promise((t,n)=>{let r=c(),i=l(r);if(!e||!i)return n();let a=new Image;a.crossOrigin=`Anonymous`,a.src=e,a.onload=()=>{r.width=a.width,r.height=a.height,i.drawImage(a,0,0,r.width,r.height);let e=i.getImageData(0,0,r.width,r.height);s.height=r.height,s.width=r.width,t(E(e.data,s))}});throw Error(`Input data provided is not supported - aborted tensor creation`)}if(o!==void 0)return E(o,s);throw Error(`Input data provided is not supported - aborted tensor creation`)},ne=(e,t)=>{let{width:n,height:r,download:i,dispose:a}=t;return new pe({location:`texture`,type:`float32`,texture:e,dims:[1,r,n,4],download:i,dispose:a})},D=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new pe({location:`gpu-buffer`,type:n??`float32`,gpuBuffer:e,dims:r,download:i,dispose:a})},O=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new pe({location:`ml-tensor`,type:n??`float32`,mlTensor:e,dims:r,download:i,dispose:a})},re=(e,t,n)=>new pe({location:`cpu-pinned`,type:e,data:t,dims:n??[t.length]})}),ae,oe,se,ce,le=o(()=>{ae=new Map([[`float32`,Float32Array],[`uint8`,Uint8Array],[`int8`,Int8Array],[`uint16`,Uint16Array],[`int16`,Int16Array],[`int32`,Int32Array],[`bool`,Uint8Array],[`float64`,Float64Array],[`uint32`,Uint32Array],[`int4`,Uint8Array],[`uint4`,Uint8Array]]),oe=new Map([[Float32Array,`float32`],[Uint8Array,`uint8`],[Int8Array,`int8`],[Uint16Array,`uint16`],[Int16Array,`int16`],[Int32Array,`int32`],[Float64Array,`float64`],[Uint32Array,`uint32`]]),se=!1,ce=()=>{if(!se){se=!0;let e=typeof BigInt64Array<`u`&&BigInt64Array.from,t=typeof BigUint64Array<`u`&&BigUint64Array.from,n=globalThis.Float16Array,r=typeof n<`u`&&n.from;e&&(ae.set(`int64`,BigInt64Array),oe.set(BigInt64Array,`int64`)),t&&(ae.set(`uint64`,BigUint64Array),oe.set(BigUint64Array,`uint64`)),r?(ae.set(`float16`,n),oe.set(n,`float16`)):ae.set(`float16`,Uint16Array)}}}),ue,de,fe=o(()=>{me(),ue=e=>{let t=1;for(let n=0;n<e.length;n++){let r=e[n];if(typeof r!=`number`||!Number.isSafeInteger(r))throw TypeError(`dims[${n}] must be an integer, got: ${r}`);if(r<0)throw RangeError(`dims[${n}] must be a non-negative integer, got: ${r}`);t*=r}return t},de=(e,t)=>{switch(e.location){case`cpu`:return new pe(e.type,e.data,t);case`cpu-pinned`:return new pe({location:`cpu-pinned`,data:e.data,type:e.type,dims:t});case`texture`:return new pe({location:`texture`,texture:e.texture,type:e.type,dims:t});case`gpu-buffer`:return new pe({location:`gpu-buffer`,gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case`ml-tensor`:return new pe({location:`ml-tensor`,mlTensor:e.mlTensor,type:e.type,dims:t});default:throw Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),pe,me=o(()=>{T(),ie(),le(),fe(),pe=class{constructor(e,t,n){ce();let r,i;if(typeof e==`object`&&`location`in e)switch(this.dataLocation=e.location,r=e.type,i=e.dims,e.location){case`cpu-pinned`:{let t=ae.get(r);if(!t)throw TypeError(`unsupported type "${r}" to create tensor from pinned buffer`);if(!(e.data instanceof t))throw TypeError(`buffer should be of type ${t.name}`);this.cpuData=e.data;break}case`texture`:if(r!==`float32`)throw TypeError(`unsupported type "${r}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break;case`gpu-buffer`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break;case`ml-tensor`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint64`&&r!==`int8`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break;default:throw Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,o;if(typeof e==`string`)if(r=e,o=n,e===`string`){if(!Array.isArray(t))throw TypeError(`A string tensor's data must be a string array.`);a=t}else{let n=ae.get(e);if(n===void 0)throw TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e===`float16`&&n===Uint16Array||e===`uint4`||e===`int4`)throw TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${n.name} as data.`);a=e===`uint64`||e===`int64`?n.from(t,BigInt):n.from(t)}else if(t instanceof n)a=t;else if(t instanceof Uint8ClampedArray)if(e===`uint8`)a=Uint8Array.from(t);else throw TypeError(`A Uint8ClampedArray tensor's data must be type of uint8`);else if(e===`float16`&&t instanceof Uint16Array&&n!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw TypeError(`A ${r} tensor's data must be type of ${n}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw TypeError(`Tensor type cannot be inferred from an empty array.`);let t=typeof e[0];if(t===`string`)r=`string`,a=e;else if(t===`boolean`)r=`bool`,a=Uint8Array.from(e);else throw TypeError(`Invalid element type of data array: ${t}.`)}else if(e instanceof Uint8ClampedArray)r=`uint8`,a=Uint8Array.from(e);else{let t=oe.get(e.constructor);if(t===void 0)throw TypeError(`Unsupported type for tensor data: ${e.constructor}.`);r=t,a=e}if(o===void 0)o=[a.length];else if(!Array.isArray(o))throw TypeError(`A tensor's dims must be a number array`);i=o,this.cpuData=a,this.dataLocation=`cpu`}let a=ue(i);if(this.cpuData&&a!==this.cpuData.length&&!((r===`uint4`||r===`int4`)&&Math.ceil(a/2)===this.cpuData.length))throw Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=r,this.dims=i,this.size=a}static async fromImage(e,t){return te(e,t)}static fromTexture(e,t){return ne(e,t)}static fromGpuBuffer(e,t){return D(e,t)}static fromMLTensor(e,t){return O(e,t)}static fromPinnedBuffer(e,t,n){return re(e,t,n)}toDataURL(e){return w(this,e)}toImageData(e){return ee(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw Error(`The data is not stored as a WebGL texture.`);return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw Error(`The data is not stored as a WebGPU buffer.`);return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw Error(`The data is not stored as a WebNN MLTensor.`);return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case`cpu`:case`cpu-pinned`:return this.data;case`texture`:case`gpu-buffer`:case`ml-tensor`:if(!this.downloader)throw Error(`The current tensor is not created with a specified data downloader.`);if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation=`cpu`,this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}default:throw Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);this.disposer&&=(this.disposer(),void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation=`none`}ensureValid(){if(this.dataLocation===`none`)throw Error(`The tensor is disposed.`)}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw Error(`Cannot reshape a tensor that owns GPU resource.`);return de(this,e)}}}),he,ge=o(()=>{me(),he=pe}),_e,ve,ye,be,k,xe,Se=o(()=>{x(),_e=(e,t)=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.timeStamp(`${e}::ORT::${t}`)},ve=(e,t)=>{let n=Error().stack?.split(/\r\n|\r|\n/g)||[],r=!1;for(let i=0;i<n.length;i++){if(r&&!n[i].includes(`TRACE_FUNC`)){let r=`FUNC_${e}::${n[i].trim().split(` `)[1]}`;t&&(r+=`::${t}`),_e(`CPU`,r);return}n[i].includes(`TRACE_FUNC`)&&(r=!0)}},ye=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||ve(`BEGIN`,e)},be=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||ve(`END`,e)},k=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.time(`ORT::${e}`)},xe=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.timeEnd(`ORT::${e}`)}}),Ce,we=o(()=>{h(),ge(),Se(),Ce=class e{constructor(e){this.handler=e}async run(e,t,n){ye(),k(`InferenceSession.run`);let r={},i={};if(typeof e!=`object`||!e||e instanceof he||Array.isArray(e))throw TypeError(`'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.`);let a=!0;if(typeof t==`object`){if(t===null)throw TypeError(`Unexpected argument[1]: cannot be null.`);if(t instanceof he)throw TypeError(`'fetches' cannot be a Tensor`);if(Array.isArray(t)){if(t.length===0)throw TypeError(`'fetches' cannot be an empty array.`);a=!1;for(let e of t){if(typeof e!=`string`)throw TypeError(`'fetches' must be a string array or an object.`);if(this.outputNames.indexOf(e)===-1)throw RangeError(`'fetches' contains invalid output name: ${e}.`);r[e]=null}if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else{let e=!1,o=Object.getOwnPropertyNames(t);for(let n of this.outputNames)if(o.indexOf(n)!==-1){let i=t[n];(i===null||i instanceof he)&&(e=!0,a=!1,r[n]=i)}if(e){if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else i=t}}else if(typeof t<`u`)throw TypeError(`Unexpected argument[1]: must be 'fetches' or 'options'.`);for(let t of this.inputNames)if(typeof e[t]>`u`)throw Error(`input '${t}' is missing in 'feeds'.`);if(a)for(let e of this.outputNames)r[e]=null;let o=await this.handler.run(e,r,i),s={};for(let e in o)if(Object.hasOwnProperty.call(o,e)){let t=o[e];t instanceof he?s[e]=t:s[e]=new he(t.type,t.data,t.dims)}return xe(`InferenceSession.run`),be(),s}async release(){return this.handler.dispose()}static async create(t,n,r,i){ye(),k(`InferenceSession.create`);let a,o={};if(typeof t==`string`){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof Uint8Array){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<`u`&&t instanceof SharedArrayBuffer){let e=t,s=0,c=t.byteLength;if(typeof n==`object`&&n)o=n;else if(typeof n==`number`){if(s=n,!Number.isSafeInteger(s))throw RangeError(`'byteOffset' must be an integer.`);if(s<0||s>=e.byteLength)throw RangeError(`'byteOffset' is out of range [0, ${e.byteLength}).`);if(c=t.byteLength-s,typeof r==`number`){if(c=r,!Number.isSafeInteger(c))throw RangeError(`'byteLength' must be an integer.`);if(c<=0||s+c>e.byteLength)throw RangeError(`'byteLength' is out of range (0, ${e.byteLength-s}].`);if(typeof i==`object`&&i)o=i;else if(typeof i<`u`)throw TypeError(`'options' must be an object.`)}else if(typeof r<`u`)throw TypeError(`'byteLength' must be a number.`)}else if(typeof n<`u`)throw TypeError(`'options' must be an object.`);a=new Uint8Array(e,s,c)}else throw TypeError(`Unexpected argument[0]: must be 'path' or 'buffer'.`);let[s,c]=await m(o),l=await s.createInferenceSessionHandler(a,c);return xe(`InferenceSession.create`),be(),new e(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Te,Ee=o(()=>{we(),Te=Ce}),De=o(()=>{}),Oe=o(()=>{}),ke=o(()=>{}),Ae=o(()=>{});s({},{InferenceSession:()=>Te,TRACE:()=>_e,TRACE_EVENT_BEGIN:()=>k,TRACE_EVENT_END:()=>xe,TRACE_FUNC_BEGIN:()=>ye,TRACE_FUNC_END:()=>be,Tensor:()=>he,env:()=>S,registerBackend:()=>f});var je=o(()=>{g(),C(),Ee(),ge(),De(),Oe(),Se(),ke(),Ae()}),Me=o(()=>{}),Ne={};s(Ne,{default:()=>Ie});var Pe,Fe,Ie,Le=o(()=>{Gu(),P(),nt(),Pe=`ort-wasm-proxy-worker`,Fe=globalThis.self?.name===Pe,Fe&&(self.onmessage=e=>{let{type:t,in:n}=e.data;try{switch(t){case`init-wasm`:ct(n.wasm).then(()=>{Nu(n).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})})},e=>{postMessage({type:t,err:e})});break;case`init-ep`:{let{epName:e,env:r}=n;Pu(r,e).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})});break}case`copy-from`:{let{buffer:e}=n,r=Ru(e);postMessage({type:t,out:r});break}case`create`:{let{model:e,options:r}=n;zu(e,r).then(e=>{postMessage({type:t,out:e})},e=>{postMessage({type:t,err:e})});break}case`release`:Bu(n),postMessage({type:t});break;case`run`:{let{sessionId:e,inputIndices:r,inputs:i,outputIndices:a,options:o}=n;Hu(e,r,i,a,Array(a.length).fill(null),o).then(e=>{e.some(e=>e[3]!==`cpu`)?postMessage({type:t,err:`Proxy does not support non-cpu tensor location.`}):postMessage({type:t,out:e},Wu([...i,...e]))},e=>{postMessage({type:t,err:e})});break}case`end-profiling`:Uu(n),postMessage({type:t});break;default:}}catch(e){postMessage({type:t,err:e})}}),Ie=Fe?null:e=>new Worker(e??Ke,{type:`module`,name:Pe})}),Re={};s(Re,{default:()=>Be});async function ze(e={}){var t=e,n=!!globalThis.window,r=!!globalThis.WorkerGlobalScope,i=r&&self.name?.startsWith(`em-pthread`);t.mountExternalData=(e,n)=>{e.startsWith(`./`)&&(e=e.substring(2)),(t.Xc||=new Map).set(e,n)},t.unmountExternalData=()=>{delete t.Xc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=e=>async(...n)=>{try{if(t.Yc)throw Error(`Session already started`);let r=t.Yc={Kd:n[0],errors:[]},i=await e(...n);if(t.Yc!==r)throw Error(`Session mismatch`);t.dd?.flush();let a=r.errors;if(0<a.length){let e=await Promise.all(a);if(e=e.filter(e=>e),0<e.length)throw Error(e.join(`
`))}return i}finally{t.Yc=null}};t.jsepInit=(e,n)=>{if(e===`webgpu`){[t.dd,t.Ad,t.Ed,t.ed,t.Dd,t.$b,t.Fd,t.Hd,t.Bd,t.Cd,t.Gd]=n;let e=t.dd;t.jsepRegisterBuffer=(t,n,r,i)=>e.registerBuffer(t,n,r,i),t.jsepGetBuffer=t=>e.getBuffer(t),t.jsepCreateDownloader=(t,n,r)=>e.createDownloader(t,n,r),t.jsepOnCreateSession=t=>{e.onCreateSession(t)},t.jsepOnReleaseSession=t=>{e.onReleaseSession(t)},t.jsepOnRunStart=t=>e.onRunStart(t),t.Id=(t,n)=>{e.upload(t,n)}}else if(e===`webnn`){let e=n[0];[t.Wd,t.sd,t.webnnEnsureTensor,t.td,t.webnnDownloadTensor,t.Rd,t.webnnEnableTraceEvent]=n.slice(1),t.webnnReleaseTensorId=t.sd,t.webnnUploadTensor=t.td,t.webnnRegisterMLContext=t.Rd,t.webnnOnRunStart=t=>e.onRunStart(t),t.webnnOnRunEnd=e.onRunEnd.bind(e),t.webnnOnReleaseSession=t=>{e.onReleaseSession(t)},t.webnnCreateMLTensorDownloader=(t,n)=>e.createMLTensorDownloader(t,n),t.webnnRegisterMLTensor=(t,n,r,i)=>e.registerMLTensor(t,n,r,i),t.webnnCreateMLContext=t=>e.createMLContext(t),t.webnnRegisterMLConstant=(n,r,i,a,o,s)=>e.registerMLConstant(n,r,i,a,o,t.Xc,s),t.webnnRegisterGraphInput=e.registerGraphInput.bind(e),t.webnnIsGraphInput=e.isGraphInput.bind(e),t.webnnRegisterGraphOutput=e.registerGraphOutput.bind(e),t.webnnIsGraphOutput=e.isGraphOutput.bind(e),t.webnnCreateTemporaryTensor=e.createTemporaryTensor.bind(e),t.webnnIsGraphInputOutputTypeSupported=e.isGraphInputOutputTypeSupported.bind(e)}};let o=()=>{let e=e=>(...t)=>{let n=$t;return t=e(...t),$t==n?t:new Promise((e,t)=>{sn={resolve:e,reject:t}})};(()=>{for(let n of[`_OrtAppendExecutionProvider`,`_OrtCreateSession`,`_OrtRun`,`_OrtRunWithBinding`,`_OrtBindInput`])t[n]=e(t[n])})(),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),o=void 0};t.asyncInit=()=>{o?.()};var s,c,l=(e,t)=>{throw t},u=import.meta.url,d=``;if(n||r){try{d=new URL(`.`,u).href}catch{}r&&(c=e=>{var t=new XMLHttpRequest;return t.open(`GET`,e,!1),t.responseType=`arraybuffer`,t.send(null),new Uint8Array(t.response)}),s=async e=>{if(C(e))return new Promise((t,n)=>{var r=new XMLHttpRequest;r.open(`GET`,e,!0),r.responseType=`arraybuffer`,r.onload=()=>{r.status==200||r.status==0&&r.response?t(r.response):n(r.status)},r.onerror=n,r.send(null)});var t=await fetch(e,{credentials:`same-origin`});if(t.ok)return t.arrayBuffer();throw Error(t.status+` : `+t.url)}}var f,p,m,h,g,_,v=console.log.bind(console),y=console.error.bind(console),b=v,x=y,S=!1,C=e=>e.startsWith(`file://`);function w(){Me.buffer!=T.buffer&&le()}if(i){let e=function(n){try{var r=n.data,i=r.Sc;if(i===`load`){let n=[];self.onmessage=e=>n.push(e),_=()=>{postMessage({Sc:`loaded`});for(let t of n)e(t);self.onmessage=e};for(let e of r.xd)t[e]&&!t[e].proxy||(t[e]=(...t)=>{postMessage({Sc:`callHandler`,wd:e,args:t})},e==`print`&&(b=t[e]),e==`printErr`&&(x=t[e]));Me=r.Od,le(),p=r.Pd,pe(),ia()}else if(i===`run`){(function(e){var t=(w(),O)[e+52>>>2>>>0];e=(w(),O)[e+56>>>2>>>0],wr(t,t-e),Y(t)})(r.Rc),gr(r.Rc,0,0,1,0,0),ke(),Ut(r.Rc),ee||=(fr(),!0);try{Ne(r.Md,r.bd)}catch(e){if(e!=`unwind`)throw e}}else r.target!==`setimmediate`&&(i===`checkMailbox`?ee&&z():i&&(x(`worker: received unknown command ${i}`),x(r)))}catch(e){throw _r(),e}};var ee=!1;self.onunhandledrejection=e=>{throw e.reason||e},self.onmessage=e}var T,E,te,ne,D,O,re,ie,ae,oe,se,ce=!1;function le(){var e=Me.buffer;t.HEAP8=T=new Int8Array(e),te=new Int16Array(e),t.HEAPU8=E=new Uint8Array(e),ne=new Uint16Array(e),t.HEAP32=D=new Int32Array(e),t.HEAPU32=O=new Uint32Array(e),re=new Float32Array(e),ie=new Float64Array(e),ae=new BigInt64Array(e),oe=new BigUint64Array(e)}function ue(){ce=!0,i?_():gi.sb()}function de(e){throw x(e=`Aborted(`+e+`)`),S=!0,e=new WebAssembly.RuntimeError(e+`. Build with -sASSERTIONS for more info.`),g?.(e),e}function fe(){return{a:{ma:bi,gb:yi,g:Ie,J:Re,f:Ue,o:We,h:Ge,ha:Ke,b:qe,T:Je,Ha:Xe,n:Ze,$:tt,Xa:nt,Da:rt,Fa:j,Ya:it,Va:M,Oa:at,Ua:ot,ka:st,Ea:ct,Ba:N,Wa:P,Ca:lt,bb:ut,ea:_t,wa:vt,ua:Et,da:Ot,O:I,H:kt,va:Mt,_:zt,xa:R,Ra:Bt,za:Wt,Ia:Kt,sa:qt,fa:Jt,Qa:Ut,_a:Yt,R:un,r:_n,c:xt,hb:vn,y:yn,M:bn,D:B,l:V,s:xn,ib:Sn,I:Cn,S:wn,j:H,u:U,q:Tn,k:En,La:Dn,Ma:K,Na:kn,Ja:An,Ka:jn,ta:Nn,db:Pn,ab:Ln,v:Bn,aa:Vn,ga:Hn,$a:Fn,W:Un,Za:Wn,Aa:Gn,F:q,U:Kn,la:Zn,ya:Qn,fb:Xn,eb:$n,Sa:rr,Ta:ir,Ga:Ce,V:ar,ja:or,Pa:sr,ia:lr,kb:na,na:Zi,lb:ta,oa:Xi,G:Vi,d:wi,t:Si,w:xi,A:Pi,mb:qi,K:Ri,x:Di,pa:Ji,Y:Qi,ba:Ki,nb:Gi,ob:Wi,P:Fi,qa:Ui,pb:Hi,N:zi,Z:Yi,e:Ci,B:Ei,m:Ti,jb:ra,p:ki,z:Ai,C:Oi,E:ji,L:Ii,qb:Bi,Q:$i,ca:Li,X:ea,rb:Ni,ra:Mi,i:ur,a:Me,cb:xe}}}async function pe(){function e(e,n){var r=gi=e.exports;e={};for(let[t,n]of Object.entries(r))typeof n==`function`?(r=Zt(n),e[t]=r):e[t]=n;return gi=e,gi=function(){var e=gi,t=e=>t=>e(t)>>>0,n=e=>()=>e()>>>0;return(e=Object.assign({},e)).tb=t(e.tb),e.Xb=n(e.Xb),e.Zb=t(e.Zb),e.lc=t(e.lc),e.mc=n(e.mc),e.qc=t(e.qc),e}(),Ee.push(gi._b),dr=(e=gi).tb,fr=e.ub,t._OrtInit=e.vb,t._OrtGetLastError=e.wb,t._OrtCreateSessionOptions=e.xb,t._OrtAppendExecutionProvider=e.yb,t._OrtAddFreeDimensionOverride=e.zb,t._OrtAddSessionConfigEntry=e.Ab,t._OrtReleaseSessionOptions=e.Bb,t._OrtCreateSession=e.Cb,t._OrtReleaseSession=e.Db,t._OrtGetInputOutputCount=e.Eb,t._OrtGetInputOutputMetadata=e.Fb,t._OrtFree=e.Gb,t._OrtCreateTensor=e.Hb,t._OrtGetTensorData=e.Ib,t._OrtReleaseTensor=e.Jb,t._OrtCreateRunOptions=e.Kb,t._OrtAddRunConfigEntry=e.Lb,t._OrtReleaseRunOptions=e.Mb,t._OrtCreateBinding=e.Nb,t._OrtBindInput=e.Ob,t._OrtBindOutput=e.Pb,t._OrtClearBoundOutputs=e.Qb,t._OrtReleaseBinding=e.Rb,t._OrtRunWithBinding=e.Sb,t._OrtRun=e.Tb,t._OrtEndProfiling=e.Ub,t._JsepOutput=e.Vb,t._JsepGetNodeName=e.Wb,pr=e.Xb,mr=t._free=e.Yb,hr=t._malloc=e.Zb,gr=e.ac,_r=e.bc,vr=e.cc,yr=e.dc,br=e.ec,xr=e.fc,Sr=e.gc,J=e.hc,Cr=e.ic,wr=e.jc,Y=e.kc,Tr=e.lc,X=e.mc,Er=e.nc,Dr=e.oc,Or=e.pc,kr=e.qc,Ar=e.rc,jr=e.sc,Mr=e.tc,Nr=e.uc,Pr=e.vc,Fr=e.wc,Ir=e.xc,Lr=e.yc,Rr=e.zc,zr=e.Ac,Br=e.Bc,Vr=e.Cc,Hr=e.Dc,Ur=e.Ec,Wr=e.Fc,Gr=e.Gc,Kr=e.Hc,qr=e.Ic,Jr=e.Jc,Yr=e.Kc,Xr=e.Lc,Zr=e.Mc,Qr=e.Nc,$r=e.Pc,ei=e.Qc,ti=e.$c,ni=e.ad,ri=e.fd,ii=e.jd,Z=e.kd,ai=e.ld,oi=e.md,si=e.nd,ci=e.od,li=e.pd,ui=e.qd,di=e.vd,fi=e.Sd,pi=e.Td,mi=e.Ud,hi=e.Vd,p=n,gi}var n,r=fe();return t.instantiateWasm?new Promise(n=>{t.instantiateWasm(r,(t,r)=>{n(e(t,r))})}):i?e(new WebAssembly.Instance(p,fe()),p):(se??=t.locateFile?t.locateFile?t.locateFile(`ort-wasm-simd-threaded.jsep.wasm`,d):d+`ort-wasm-simd-threaded.jsep.wasm`:new URL(`/ChessCoach/assets/ort-wasm-simd-threaded.jsep-CyqnNavA.wasm`,``+import.meta.url).href,n=await async function(e){var t=se;if(!f&&!C(t))try{var n=fetch(t,{credentials:`same-origin`});return await WebAssembly.instantiateStreaming(n,e)}catch(e){x(`wasm streaming compile failed: ${e}`),x(`falling back to ArrayBuffer instantiation`)}return async function(e,t){try{var n=await async function(e){if(!f)try{var t=await s(e);return new Uint8Array(t)}catch{}if(e==se&&f)e=new Uint8Array(f);else{if(!c)throw`both async and sync fetching of the wasm failed`;e=c(e)}return e}(e);return await WebAssembly.instantiate(n,t)}catch(e){x(`failed to asynchronously prepare wasm: ${e}`),de(e)}}(t,e)}(r),e(n.instance,n.module))}class me{name=`ExitStatus`;constructor(e){this.message=`Program terminated with exit(${e})`,this.status=e}}var he=e=>{e.terminate(),e.onmessage=()=>{}},ge=[],_e=0,ve=null,ye=e=>{we.length==0&&(je(),Ae(we[0]));var t=we.pop();if(!t)return 6;Te.push(t),De[e.Rc]=t,t.Rc=e.Rc;var n={Sc:`run`,Md:e.Ld,bd:e.bd,Rc:e.Rc};return t.postMessage(n,e.rd),0},be=0,k=(e,t,...n)=>{var r,i=16*n.length,a=X(),o=Tr(i),s=o>>>3;for(r of n)typeof r==`bigint`?((w(),ae)[s++>>>0]=1n,(w(),ae)[s++>>>0]=r):((w(),ae)[s++>>>0]=0n,(w(),ie)[s++>>>0]=r);return e=vr(e,0,i,o,t),Y(a),e};function xe(e){if(i)return k(0,1,e);if(m=e,!(0<be)){for(var t of Te)he(t);for(t of we)he(t);we=[],Te=[],De={},S=!0}l(0,new me(e))}function Se(e){if(i)return k(1,0,e);Ce(e)}var Ce=e=>{if(m=e,i)throw Se(e),`unwind`;xe(e)},we=[],Te=[],Ee=[],De={},Oe=e=>{var t=e.Rc;delete De[t],we.push(e),Te.splice(Te.indexOf(e),1),e.Rc=0,yr(t)};function ke(){Ee.forEach(e=>e())}var Ae=e=>new Promise(n=>{e.onmessage=r=>{var i=r.data;if(r=i.Sc,i.Zc&&i.Zc!=pr()){var a=De[i.Zc];a?a.postMessage(i,i.rd):x(`Internal error! Worker sent a message "${r}" to target pthread ${i.Zc}, but that thread no longer exists!`)}else r===`checkMailbox`?z():r===`spawnThread`?ye(i):r===`cleanupThread`?Vt(()=>{Oe(De[i.Nd])}):r===`loaded`?(e.loaded=!0,n(e)):i.target===`setimmediate`?e.postMessage(i):r===`uncaughtException`?e.onerror(i.error):r===`callHandler`?t[i.wd](...i.args):r&&x(`worker sent an unknown command ${r}`)},e.onerror=e=>{throw x(`worker sent an error! ${e.filename}:${e.lineno}: ${e.message}`),e};var r,i=[];for(r of[])t.propertyIsEnumerable(r)&&i.push(r);e.postMessage({Sc:`load`,xd:i,Od:Me,Pd:p})});function je(){var e=new Worker((()=>{let e=URL;return import.meta.url>`file:`&&import.meta.url<`file;`?new e(`ort.bundle.min.mjs`,import.meta.url):new URL(import.meta.url)})(),{type:`module`,workerData:`em-pthread`,name:`em-pthread`});we.push(e)}var Me,Ne=(e,t)=>{be=0,e=jr(e,t),0<be?m=e:br(e)},Pe=[],Fe=0;function Ie(e){var t=new Ve(e>>>=0);return(w(),T)[t.Tc+12>>>0]==0&&(ze(t,!0),Fe--),Be(t,!1),Pe.push(t),kr(e)}var Le=0,Re=()=>{J(0,0);var e=Pe.pop();Er(e.cd),Le=0};function ze(e,t){t=+!!t,(w(),T)[e.Tc+12>>>0]=t}function Be(e,t){t=+!!t,(w(),T)[e.Tc+13>>>0]=t}class Ve{constructor(e){this.cd=e,this.Tc=e-24}}var He=e=>{var t=Le;if(!t)return Cr(0),0;var n=new Ve(t);(w(),O)[n.Tc+16>>>2>>>0]=t;var r=(w(),O)[n.Tc+4>>>2>>>0];if(!r)return Cr(0),t;for(var i of e){if(i===0||i===r)break;if(Or(i,r,n.Tc+16))return Cr(i),t}return Cr(r),t};function Ue(){return He([])}function We(e){return He([e>>>0])}function Ge(e,t,n,r){return He([e>>>0,t>>>0,n>>>0,r>>>0])}var Ke=()=>{var e=Pe.pop();e||de(`no exception to throw`);var t=e.cd;throw(w(),T)[e.Tc+13>>>0]==0&&(Pe.push(e),Be(e,!0),ze(e,!1),Fe++),Dr(t),Le=t};function qe(e,t,n){var r=new Ve(e>>>=0);throw t>>>=0,n>>>=0,(w(),O)[r.Tc+16>>>2>>>0]=0,(w(),O)[r.Tc+4>>>2>>>0]=t,(w(),O)[r.Tc+8>>>2>>>0]=n,Dr(e),Fe++,Le=e}var Je=()=>Fe;function Ye(e,t,n,r){return i?k(2,1,e,t,n,r):Xe(e,t,n,r)}function Xe(e,t,n,r){if(e>>>=0,t>>>=0,n>>>=0,r>>>=0,!globalThis.SharedArrayBuffer)return 6;var a=[];return i&&a.length===0?Ye(e,t,n,r):(e={Ld:n,Rc:e,bd:r,rd:a},i?(e.Sc=`spawnThread`,postMessage(e,a),0):ye(e))}function Ze(e){throw Le||=e>>>0,Le}var Qe=globalThis.TextDecoder&&new TextDecoder,$e=(e,t,n,r)=>{if(n=t+n,r)return n;for(;e[t]&&!(t>=n);)++t;return t},et=(e,t=0,n,r)=>{if(16<(n=$e(e,t>>>=0,n,r))-t&&e.buffer&&Qe)return Qe.decode(e.buffer instanceof ArrayBuffer?e.subarray(t,n):e.slice(t,n));for(r=``;t<n;){var i=e[t++];if(128&i){var a=63&e[t++];if((224&i)==192)r+=String.fromCharCode((31&i)<<6|a);else{var o=63&e[t++];65536>(i=(240&i)==224?(15&i)<<12|a<<6|o:(7&i)<<18|a<<12|o<<6|63&e[t++])?r+=String.fromCharCode(i):(i-=65536,r+=String.fromCharCode(55296|i>>10,56320|1023&i))}}else r+=String.fromCharCode(i)}return r},A=(e,t,n)=>(e>>>=0)?et((w(),E),e,t,n):``;function tt(e,t,n){return i?k(3,1,e,t,n):0}function nt(e,t){if(i)return k(4,1,e,t)}function rt(e,t){if(i)return k(5,1,e,t)}function j(e,t,n){if(i)return k(6,1,e,t,n)}function it(e,t,n){return i?k(7,1,e,t,n):0}function M(e,t){if(i)return k(8,1,e,t)}function at(e,t,n){if(i)return k(9,1,e,t,n)}function ot(e,t,n,r){if(i)return k(10,1,e,t,n,r)}function st(e,t,n,r){if(i)return k(11,1,e,t,n,r)}function ct(e,t,n,r){if(i)return k(12,1,e,t,n,r)}function N(e){if(i)return k(13,1,e)}function P(e,t){if(i)return k(14,1,e,t)}function lt(e,t,n){if(i)return k(15,1,e,t,n)}var ut=()=>de(``),F=e=>{e>>>=0;for(var t=``;;){var n=(w(),E)[e++>>>0];if(!n)return t;t+=String.fromCharCode(n)}},dt={},ft={},pt={},mt=class extends Error{constructor(e){super(e),this.name=`BindingError`}};function ht(e,t,n={}){return function(e,t,n={}){var r=t.name;if(!e)throw new mt(`type "${r}" must have a positive integer typeid pointer`);if(ft.hasOwnProperty(e)){if(n.yd)return;throw new mt(`Cannot register type '${r}' twice`)}ft[e]=t,delete pt[e],dt.hasOwnProperty(e)&&(t=dt[e],delete dt[e],t.forEach(e=>e()))}(e,t,n)}var gt=(e,t,n)=>{switch(t){case 1:return n?e=>(w(),T)[e>>>0]:e=>(w(),E)[e>>>0];case 2:return n?e=>(w(),te)[e>>>1>>>0]:e=>(w(),ne)[e>>>1>>>0];case 4:return n?e=>(w(),D)[e>>>2>>>0]:e=>(w(),O)[e>>>2>>>0];case 8:return n?e=>(w(),ae)[e>>>3>>>0]:e=>(w(),oe)[e>>>3>>>0];default:throw TypeError(`invalid integer width (${t}): ${e}`)}};function _t(e,t,n,r,i){e>>>=0,n>>>=0,t=F(t>>>0);let a=e=>e;if(r=r===0n){let e=8*n;a=t=>BigInt.asUintN(e,t),i=a(i)}ht(e,{name:t,Oc:a,Vc:(e,t)=>(typeof t==`number`&&(t=BigInt(t)),t),Uc:gt(t,n,!r),Wc:null})}function vt(e,t,n,r){ht(e>>>=0,{name:t=F(t>>>0),Oc:function(e){return!!e},Vc:function(e,t){return t?n:r},Uc:function(e){return this.Oc((w(),E)[e>>>0])},Wc:null})}var yt=[],bt=[0,1,,1,null,1,!0,1,!1,1];function xt(e){9<(e>>>=0)&&--bt[e+1]==0&&(bt[e]=void 0,yt.push(e))}var St=e=>{if(!e)throw new mt(`Cannot use deleted val. handle = ${e}`);return bt[e]},Ct=e=>{switch(e){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let t=yt.pop()||bt.length;return bt[t]=e,bt[t+1]=1,t}};function wt(e){return this.Oc((w(),O)[e>>>2>>>0])}var Tt={name:`emscripten::val`,Oc:e=>{var t=St(e);return xt(e),t},Vc:(e,t)=>Ct(t),Uc:wt,Wc:null};function Et(e){return ht(e>>>0,Tt)}var Dt=(e,t)=>{switch(t){case 4:return function(e){return this.Oc((w(),re)[e>>>2>>>0])};case 8:return function(e){return this.Oc((w(),ie)[e>>>3>>>0])};default:throw TypeError(`invalid float width (${t}): ${e}`)}};function Ot(e,t,n){n>>>=0,ht(e>>>=0,{name:t=F(t>>>0),Oc:e=>e,Vc:(e,t)=>t,Uc:Dt(t,n),Wc:null})}function I(e,t,n,r,i){e>>>=0,n>>>=0,t=F(t>>>0);let a=e=>e;if(r===0){var o=32-8*n;a=e=>e<<o>>>o,i=a(i)}ht(e,{name:t,Oc:a,Vc:(e,t)=>t,Uc:gt(t,n,r!==0),Wc:null})}function kt(e,t,n){function r(e){var t=(w(),O)[e>>>2>>>0];return e=(w(),O)[e+4>>>2>>>0],new i((w(),T).buffer,e,t)}var i=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][t];ht(e>>>=0,{name:n=F(n>>>0),Oc:r,Uc:r},{yd:!0})}var At=(e,t,n)=>{var r=(w(),E);if(t>>>=0,0<n){var i=t;n=t+n-1;for(var a=0;a<e.length;++a){var o=e.codePointAt(a);if(127>=o){if(t>=n)break;r[t++>>>0]=o}else if(2047>=o){if(t+1>=n)break;r[t++>>>0]=192|o>>6,r[t++>>>0]=128|63&o}else if(65535>=o){if(t+2>=n)break;r[t++>>>0]=224|o>>12,r[t++>>>0]=128|o>>6&63,r[t++>>>0]=128|63&o}else{if(t+3>=n)break;r[t++>>>0]=240|o>>18,r[t++>>>0]=128|o>>12&63,r[t++>>>0]=128|o>>6&63,r[t++>>>0]=128|63&o,a++}}r[t>>>0]=0,e=t-i}else e=0;return e},jt=e=>{for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);127>=r?t++:2047>=r?t+=2:55296<=r&&57343>=r?(t+=4,++n):t+=3}return t};function Mt(e,t){ht(e>>>=0,{name:t=F(t>>>0),Oc(e){var t=(w(),O)[e>>>2>>>0];return t=A(e+4,t,!0),mr(e),t},Vc(e,t){t instanceof ArrayBuffer&&(t=new Uint8Array(t));var n=typeof t==`string`;if(!(n||ArrayBuffer.isView(t)&&t.BYTES_PER_ELEMENT==1))throw new mt(`Cannot pass non-string to std::string`);var r=n?jt(t):t.length,i=hr(4+r+1),a=i+4;return(w(),O)[i>>>2>>>0]=r,n?At(t,a,r+1):(w(),E).set(t,a>>>0),e!==null&&e.push(mr,i),i},Uc:wt,Wc(e){mr(e)}})}var Nt=globalThis.TextDecoder?new TextDecoder(`utf-16le`):void 0,Pt=(e,t,n)=>{if(e>>>=1,16<(t=$e((w(),ne),e,t/2,n))-e&&Nt)return Nt.decode((w(),ne).slice(e,t));for(n=``;e<t;++e){var r=(w(),ne)[e>>>0];n+=String.fromCharCode(r)}return n},Ft=(e,t,n)=>{if(n??=2147483647,2>n)return 0;var r=t;n=(n-=2)<2*e.length?n/2:e.length;for(var i=0;i<n;++i){var a=e.charCodeAt(i);(w(),te)[t>>>1>>>0]=a,t+=2}return(w(),te)[t>>>1>>>0]=0,t-r},It=e=>2*e.length,L=(e,t,n)=>{var r=``;e>>>=2;for(var i=0;!(i>=t/4);i++){var a=(w(),O)[e+i>>>0];if(!a&&!n)break;r+=String.fromCodePoint(a)}return r},Lt=(e,t,n)=>{if(t>>>=0,n??=2147483647,4>n)return 0;var r=t;n=r+n-4;for(var i=0;i<e.length;++i){var a=e.codePointAt(i);if(65535<a&&i++,(w(),D)[t>>>2>>>0]=a,(t+=4)+4>n)break}return(w(),D)[t>>>2>>>0]=0,t-r},Rt=e=>{for(var t=0,n=0;n<e.length;++n)65535<e.codePointAt(n)&&n++,t+=4;return t};function zt(e,t,n){if(e>>>=0,t>>>=0,n=F(n>>>=0),t===2)var r=Pt,i=Ft,a=It;else r=L,i=Lt,a=Rt;ht(e,{name:n,Oc:e=>{var n=(w(),O)[e>>>2>>>0];return n=r(e+4,n*t,!0),mr(e),n},Vc:(e,r)=>{if(typeof r!=`string`)throw new mt(`Cannot pass non-string to C++ string type ${n}`);var o=a(r),s=hr(4+o+t);return(w(),O)[s>>>2>>>0]=o/t,i(r,s+4,o+t),e!==null&&e.push(mr,s),s},Uc:wt,Wc(e){mr(e)}})}function R(e,t){ht(e>>>=0,{zd:!0,name:t=F(t>>>0),Oc:()=>{},Vc:()=>{}})}function Bt(e){gr(e>>>0,!r,1,!n,131072,!1),ke()}var Vt=e=>{if(!S)try{if(e(),!(0<be))try{i?pr()&&br(m):Ce(m)}catch(e){e instanceof me||e==`unwind`||l(0,e)}}catch(e){e instanceof me||e==`unwind`||l(0,e)}},Ht=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Ut(e){e>>>=0,Ht||(Atomics.waitAsync((w(),D),e>>>2,e).value.then(z),e+=128,Atomics.store((w(),D),e>>>2,1))}var z=()=>Vt(()=>{var e=pr();e&&(Ut(e),Sr())});function Wt(e,t){(e>>>=0)==t>>>0?setTimeout(z):i?postMessage({Zc:e,Sc:`checkMailbox`}):(e=De[e])&&e.postMessage({Sc:`checkMailbox`})}var Gt=[];function Kt(e,t,n,r,i){for(t>>>=0,i>>>=0,Gt.length=0,n=i>>>3,r=i+r>>>3;n<r;){var a=(w(),ae)[n++>>>0]?(w(),ae)[n++>>>0]:(w(),ie)[n++>>>0];Gt.push(a)}return(t?vi[t]:_i[e])(...Gt)}var qt=()=>{be=0};function Jt(e){e>>>=0,i?postMessage({Sc:`cleanupThread`,Nd:e}):Oe(De[e])}function Yt(e){}var Xt=e=>{try{e()}catch(e){de(e)}};function Zt(e){var t=(...t)=>{tn.push(e);try{return e(...t)}finally{S||(tn.pop(),$t&&Qt===1&&tn.length===0&&(Qt=0,be+=1,Xt(pi),typeof Fibers<`u`&&Fibers.Zd()))}};return an.set(e,t),t}var Qt=0,$t=null,en=0,tn=[],nn=new Map,rn=new Map,an=new Map,on=0,sn=null,cn=[],ln=e=>function(e){if(!S){if(Qt===0){var t=!1,n=!1;e((e=0)=>{if(!S&&(en=e,t=!0,n)){Qt=2,Xt(()=>mi($t)),typeof MainLoop<`u`&&MainLoop.ud&&MainLoop.resume(),e=!1;try{var r=function(){var e=(w(),D)[$t+8>>>2>>>0];return e=rn.get(e),e=an.get(e),--be,e()}()}catch(t){r=t,e=!0}var i=!1;if(!$t){var a=sn;a&&(sn=null,(e?a.reject:a.resolve)(r),i=!0)}if(e&&!i)throw r}}),n=!0,t||(Qt=1,$t=function(){var e=hr(65548),t=e+12;if((w(),O)[e>>>2>>>0]=t,(w(),O)[e+4>>>2>>>0]=t+65536,t=tn[0],!nn.has(t)){var n=on++;nn.set(t,n),rn.set(n,t)}return t=nn.get(t),(w(),D)[e+8>>>2>>>0]=t,e}(),typeof MainLoop<`u`&&MainLoop.ud&&MainLoop.pause(),Xt(()=>fi($t)))}else Qt===2?(Qt=0,Xt(hi),mr($t),$t=null,cn.forEach(Vt)):de(`invalid state: ${Qt}`);return en}}(t=>{e().then(t)});function un(e){return e>>>=0,ln(async()=>Ct(await St(e)))}var dn=[],fn=e=>{var t=dn.length;return dn.push(e),t},pn=(e,t)=>{for(var n=Array(e),r=0;r<e;++r){var i=r,a=(w(),O)[t+4*r>>>2>>>0],o=ft[a];if(o===void 0)throw e=`parameter ${r}`,a=dr(a),t=F(a),mr(a),new mt(`${e} has unknown type ${t}`);n[i]=o}return n},mn=(e,t,n)=>{var r=[];return e=e(r,n),r.length&&((w(),O)[t>>>2>>>0]=Ct(r)),e},hn={},gn=e=>{var t=hn[e];return t===void 0?F(e):t};function _n(e,t,n){var[r,...i]=pn(e,t>>>0);t=r.Vc.bind(r);var a=i.map(e=>e.Uc.bind(e));e--;var o={toValue:St};switch(e=a.map((e,t)=>{var n=`argFromPtr${t}`;return o[n]=e,`${n}(args${t?`+`+8*t:``})`}),n){case 0:var s=`toValue(handle)`;break;case 2:s=`new (toValue(handle))`;break;case 3:s=``;break;case 1:o.getStringOrSymbol=gn,s=`toValue(handle)[getStringOrSymbol(methodName)]`}return s+=`(${e})`,r.zd||(o.toReturnWire=t,o.emval_returnValue=mn,s=`return emval_returnValue(toReturnWire, destructorsRef, ${s})`),s=`return function (handle, methodName, destructorsRef, args) {
  ${s}
  }`,n=Function(Object.keys(o),s)(...Object.values(o)),s=`methodCaller<(${i.map(e=>e.name)}) => ${r.name}>`,fn(Object.defineProperty(n,`name`,{value:s}))}function vn(e,t){return t>>>=0,(e=St(e>>>0))==St(t)}function yn(e){return(e>>>=0)?(e=gn(e),Ct(globalThis[e])):Ct(globalThis)}function bn(e){return e=gn(e>>>0),Ct(t[e])}function B(e,t){return t>>>=0,e=St(e>>>0),t=St(t),Ct(e[t])}function V(e){9<(e>>>=0)&&(bt[e+1]+=1)}function xn(e,t,n,r,i){return dn[e>>>0](t>>>0,n>>>0,r>>>0,i>>>0)}function Sn(e,t,n,r,i){return xn(e>>>0,t>>>0,n>>>0,r>>>0,i>>>0)}function Cn(){return Ct([])}function wn(e){e=St(e>>>0);for(var t=Array(e.length),n=0;n<e.length;n++)t[n]=e[n];return Ct(t)}function H(e){return Ct(gn(e>>>0))}function U(){return Ct({})}function Tn(e){for(var t=St(e>>>=0);t.length;){var n=t.pop();t.pop()(n)}xt(e)}function En(e,t,n){t>>>=0,n>>>=0,e=St(e>>>0),t=St(t),n=St(n),e[t]=n}function Dn(e,t){e=-9007199254740992>e||9007199254740992<e?NaN:Number(e),t>>>=0,e=new Date(1e3*e),(w(),D)[t>>>2>>>0]=e.getUTCSeconds(),(w(),D)[t+4>>>2>>>0]=e.getUTCMinutes(),(w(),D)[t+8>>>2>>>0]=e.getUTCHours(),(w(),D)[t+12>>>2>>>0]=e.getUTCDate(),(w(),D)[t+16>>>2>>>0]=e.getUTCMonth(),(w(),D)[t+20>>>2>>>0]=e.getUTCFullYear()-1900,(w(),D)[t+24>>>2>>>0]=e.getUTCDay(),e=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(w(),D)[t+28>>>2>>>0]=e}var W=e=>e%4==0&&(e%100!=0||e%400==0),On=[0,31,60,91,121,152,182,213,244,274,305,335],G=[0,31,59,90,120,151,181,212,243,273,304,334];function K(e,t){e=-9007199254740992>e||9007199254740992<e?NaN:Number(e),t>>>=0,e=new Date(1e3*e),(w(),D)[t>>>2>>>0]=e.getSeconds(),(w(),D)[t+4>>>2>>>0]=e.getMinutes(),(w(),D)[t+8>>>2>>>0]=e.getHours(),(w(),D)[t+12>>>2>>>0]=e.getDate(),(w(),D)[t+16>>>2>>>0]=e.getMonth(),(w(),D)[t+20>>>2>>>0]=e.getFullYear()-1900,(w(),D)[t+24>>>2>>>0]=e.getDay();var n=(W(e.getFullYear())?On:G)[e.getMonth()]+e.getDate()-1|0;(w(),D)[t+28>>>2>>>0]=n,(w(),D)[t+36>>>2>>>0]=-60*e.getTimezoneOffset(),n=new Date(e.getFullYear(),6,1).getTimezoneOffset();var r=new Date(e.getFullYear(),0,1).getTimezoneOffset();e=0|(n!=r&&e.getTimezoneOffset()==Math.min(r,n)),(w(),D)[t+32>>>2>>>0]=e}function kn(e){e>>>=0;var t=new Date((w(),D)[e+20>>>2>>>0]+1900,(w(),D)[e+16>>>2>>>0],(w(),D)[e+12>>>2>>>0],(w(),D)[e+8>>>2>>>0],(w(),D)[e+4>>>2>>>0],(w(),D)[e>>>2>>>0],0),n=(w(),D)[e+32>>>2>>>0],r=t.getTimezoneOffset(),i=new Date(t.getFullYear(),6,1).getTimezoneOffset(),a=new Date(t.getFullYear(),0,1).getTimezoneOffset(),o=Math.min(a,i);return 0>n?(w(),D)[e+32>>>2>>>0]=+(i!=a&&o==r):0<n!=(o==r)&&(i=Math.max(a,i),t.setTime(t.getTime()+6e4*((0<n?o:i)-r))),(w(),D)[e+24>>>2>>>0]=t.getDay(),n=(W(t.getFullYear())?On:G)[t.getMonth()]+t.getDate()-1|0,(w(),D)[e+28>>>2>>>0]=n,(w(),D)[e>>>2>>>0]=t.getSeconds(),(w(),D)[e+4>>>2>>>0]=t.getMinutes(),(w(),D)[e+8>>>2>>>0]=t.getHours(),(w(),D)[e+12>>>2>>>0]=t.getDate(),(w(),D)[e+16>>>2>>>0]=t.getMonth(),(w(),D)[e+20>>>2>>>0]=t.getYear(),e=t.getTime(),BigInt(isNaN(e)?-1:e/1e3)}function An(e,t,n,r,a,o,s){return i?k(16,1,e,t,n,r,a,o,s):-52}function jn(e,t,n,r,a,o){if(i)return k(17,1,e,t,n,r,a,o)}var Mn={},q=()=>performance.timeOrigin+performance.now();function Nn(e,t){return i?k(18,1,e,t):(Mn[e]&&(clearTimeout(Mn[e].id),delete Mn[e]),t&&(Mn[e]={id:setTimeout(()=>{delete Mn[e],Vt(()=>xr(e,performance.timeOrigin+performance.now()))},t),Yd:t}),0)}function Pn(e,t,n,r){e>>>=0,t>>>=0,n>>>=0,r>>>=0;var i=new Date().getFullYear(),a=new Date(i,0,1).getTimezoneOffset();i=new Date(i,6,1).getTimezoneOffset();var o=Math.max(a,i);(w(),O)[e>>>2>>>0]=60*o,(w(),D)[t>>>2>>>0]=+(a!=i),e=(t=e=>{var t=Math.abs(e);return`UTC${0<=e?`-`:`+`}${String(Math.floor(t/60)).padStart(2,`0`)}${String(t%60).padStart(2,`0`)}`})(a),t=t(i),i<a?(At(e,n,17),At(t,r,17)):(At(e,r,17),At(t,n,17))}var Fn=()=>Date.now(),In=1;function Ln(e,t,n){if(n>>>=0,!(0<=e&&3>=e))return 28;if(e===0)e=Date.now();else{if(!In)return 52;e=performance.timeOrigin+performance.now()}return e=Math.round(1e6*e),(w(),ae)[n>>>3>>>0]=BigInt(e),0}var Rn=[],zn=(e,t)=>{Rn.length=0;for(var n;n=(w(),E)[e++>>>0];){var r=n!=105;t+=(r&=n!=112)&&t%8?4:0,Rn.push(n==112?(w(),O)[t>>>2>>>0]:n==106?(w(),ae)[t>>>3>>>0]:n==105?(w(),D)[t>>>2>>>0]:(w(),ie)[t>>>3>>>0]),t+=r?8:4}return Rn};function Bn(e,t,n){return e>>>=0,t=zn(t>>>0,n>>>0),vi[e](...t)}function Vn(e,t,n){return e>>>=0,t=zn(t>>>0,n>>>0),vi[e](...t)}var Hn=()=>{};function Un(e,t){return x(A(e>>>0,t>>>0))}var Wn=()=>{throw be+=1,`unwind`};function Gn(){return 4294901760}var Kn=()=>navigator.hardwareConcurrency,qn={},Jn=e=>{var t;return(t=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(e))?+t[1]:(t=/:(\d+):\d+(?:\)|$)/.exec(e))?2147483648|t[1]:0},Yn=e=>{for(var t of e)(e=Jn(t))&&(qn[e]=t)};function Xn(){var e=Error().stack.toString().split(`
`);return e[0]==`Error`&&e.shift(),Yn(e),qn.gd=Jn(e[3]),qn.Jd=e,qn.gd}function Zn(e){if(!(e=qn[e>>>0]))return 0;var t;if(t=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(e))e=t[1];else if(t=/^\s+at (.*) \(.*\)$/.exec(e))e=t[1];else{if(!(t=/^(.+?)@/.exec(e)))return 0;e=t[1]}mr(Zn.hd??0),t=jt(e)+1;var n=hr(t);return n&&At(e,n,t),Zn.hd=n,Zn.hd}function Qn(e){e>>>=0;var t=(w(),E).length;if(e<=t||4294901760<e)return!1;for(var n=1;4>=n;n*=2){var r=t*(1+.2/n);r=Math.min(r,e+100663296);e:{r=(Math.min(4294901760,65536*Math.ceil(Math.max(e,r)/65536))-Me.buffer.byteLength+65535)/65536|0;try{Me.grow(r),le();var i=1;break e}catch{}i=void 0}if(i)return!0}return!1}function $n(e,t,n){if(e>>>=0,t>>>=0,qn.gd==e)var r=qn.Jd;else (r=Error().stack.toString().split(`
`))[0]==`Error`&&r.shift(),Yn(r);for(var i=3;r[i]&&Jn(r[i])!=e;)++i;for(e=0;e<n&&r[e+i];++e)(w(),D)[t+4*e>>>2>>>0]=Jn(r[e+i]);return e}var er,tr={},nr=()=>{if(!er){var e,t={USER:`web_user`,LOGNAME:`web_user`,PATH:`/`,PWD:`/`,HOME:`/home/web_user`,LANG:(globalThis.navigator?.language??`C`).replace(`-`,`_`)+`.UTF-8`,_:`./this.program`};for(e in tr)tr[e]===void 0?delete t[e]:t[e]=tr[e];var n=[];for(e in t)n.push(`${e}=${t[e]}`);er=n}return er};function rr(e,t){if(i)return k(19,1,e,t);e>>>=0,t>>>=0;var n,r=0,a=0;for(n of nr()){var o=t+r;(w(),O)[e+a>>>2>>>0]=o,r+=At(n,o,1/0)+1,a+=4}return 0}function ir(e,t){if(i)return k(20,1,e,t);e>>>=0,t>>>=0;var n=nr();for(var r of((w(),O)[e>>>2>>>0]=n.length,e=0,n))e+=jt(r)+1;return(w(),O)[t>>>2>>>0]=e,0}function ar(e){return i?k(21,1,e):52}function or(e,t,n,r){return i?k(22,1,e,t,n,r):52}function sr(e,t,n,r){return i?k(23,1,e,t,n,r):70}var cr=[null,[],[]];function lr(e,t,n,r){if(i)return k(24,1,e,t,n,r);t>>>=0,n>>>=0,r>>>=0;for(var a=0,o=0;o<n;o++){var s=(w(),O)[t>>>2>>>0],c=(w(),O)[t+4>>>2>>>0];t+=8;for(var l=0;l<c;l++){var u=e,d=(w(),E)[s+l>>>0],f=cr[u];d===0||d===10?((u===1?b:x)(et(f)),f.length=0):f.push(d)}a+=c}return(w(),O)[r>>>2>>>0]=a,0}function ur(e){return e>>>0}i||function(){for(var e=t.numThreads-1;e--;)je();ge.push(async()=>{var e=async function(){if(!i)return Promise.all(we.map(Ae))}();_e++,await e,--_e==0&&ve&&(e=ve,ve=null,e())})}(),i||(Me=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),le()),t.wasmBinary&&(f=t.wasmBinary),t.stackSave=()=>X(),t.stackRestore=e=>Y(e),t.stackAlloc=e=>Tr(e),t.setValue=function(e,t,n=`i8`){switch(n.endsWith(`*`)&&(n=`*`),n){case`i1`:case`i8`:(w(),T)[e>>>0]=t;break;case`i16`:(w(),te)[e>>>1>>>0]=t;break;case`i32`:(w(),D)[e>>>2>>>0]=t;break;case`i64`:(w(),ae)[e>>>3>>>0]=BigInt(t);break;case`float`:(w(),re)[e>>>2>>>0]=t;break;case`double`:(w(),ie)[e>>>3>>>0]=t;break;case`*`:(w(),O)[e>>>2>>>0]=t;break;default:de(`invalid type for setValue: ${n}`)}},t.getValue=function(e,t=`i8`){switch(t.endsWith(`*`)&&(t=`*`),t){case`i1`:case`i8`:return(w(),T)[e>>>0];case`i16`:return(w(),te)[e>>>1>>>0];case`i32`:return(w(),D)[e>>>2>>>0];case`i64`:return(w(),ae)[e>>>3>>>0];case`float`:return(w(),re)[e>>>2>>>0];case`double`:return(w(),ie)[e>>>3>>>0];case`*`:return(w(),O)[e>>>2>>>0];default:de(`invalid type for getValue: ${t}`)}},t.UTF8ToString=A,t.stringToUTF8=At,t.lengthBytesUTF8=jt;var dr,fr,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,J,Cr,wr,Y,Tr,X,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,ii,Z,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i=[xe,Se,Ye,tt,nt,rt,j,it,M,at,ot,st,ct,N,P,lt,An,jn,Nn,rr,ir,ar,or,sr,lr],vi={973212:(e,n,r,i,a)=>{if(t===void 0||!t.Xc)return 1;if((e=A(Number(e>>>0))).startsWith(`./`)&&(e=e.substring(2)),!(e=t.Xc.get(e)))return 2;if(n=Number(n>>>0),r=Number(r>>>0),i=Number(i>>>0),n+r>e.byteLength)return 3;try{let o=e.subarray(n,n+r);switch(a){case 0:(w(),E).set(o,i>>>0);break;case 1:t.Qd?t.Qd(i,o):t.Id(i,o);break;default:return 4}return 0}catch{return 4}},974036:(e,n,r)=>{t.td(e,(w(),E).subarray(n>>>0,n+r>>>0))},974100:()=>t.Wd(),974142:e=>{t.sd(e)},974179:()=>{t.Bd()},974210:()=>{t.Cd()},974239:()=>{t.Gd()},974264:e=>t.Ad(e),974297:e=>t.Ed(e),974329:(e,n,r)=>{t.ed(Number(e),Number(n),Number(r),!0)},974392:(e,n,r)=>{t.ed(Number(e),Number(n),Number(r))},974449:()=>typeof wasmOffsetConverter<`u`,974506:e=>{t.$b(`Abs`,e,void 0)},974557:e=>{t.$b(`Neg`,e,void 0)},974608:e=>{t.$b(`Floor`,e,void 0)},974661:e=>{t.$b(`Ceil`,e,void 0)},974713:e=>{t.$b(`Reciprocal`,e,void 0)},974771:e=>{t.$b(`Sqrt`,e,void 0)},974823:e=>{t.$b(`Exp`,e,void 0)},974874:e=>{t.$b(`Erf`,e,void 0)},974925:e=>{t.$b(`Sigmoid`,e,void 0)},974980:(e,n,r)=>{t.$b(`HardSigmoid`,e,{alpha:n,beta:r})},975059:e=>{t.$b(`Log`,e,void 0)},975110:e=>{t.$b(`Sin`,e,void 0)},975161:e=>{t.$b(`Cos`,e,void 0)},975212:e=>{t.$b(`Tan`,e,void 0)},975263:e=>{t.$b(`Asin`,e,void 0)},975315:e=>{t.$b(`Acos`,e,void 0)},975367:e=>{t.$b(`Atan`,e,void 0)},975419:e=>{t.$b(`Sinh`,e,void 0)},975471:e=>{t.$b(`Cosh`,e,void 0)},975523:e=>{t.$b(`Asinh`,e,void 0)},975576:e=>{t.$b(`Acosh`,e,void 0)},975629:e=>{t.$b(`Atanh`,e,void 0)},975682:e=>{t.$b(`Tanh`,e,void 0)},975734:e=>{t.$b(`Not`,e,void 0)},975785:(e,n,r)=>{t.$b(`Clip`,e,{min:n,max:r})},975854:e=>{t.$b(`Clip`,e,void 0)},975906:(e,n)=>{t.$b(`Elu`,e,{alpha:n})},975964:e=>{t.$b(`Gelu`,e,void 0)},976016:e=>{t.$b(`Relu`,e,void 0)},976068:(e,n)=>{t.$b(`LeakyRelu`,e,{alpha:n})},976132:(e,n)=>{t.$b(`ThresholdedRelu`,e,{alpha:n})},976202:(e,n)=>{t.$b(`Cast`,e,{to:n})},976260:e=>{t.$b(`Add`,e,void 0)},976311:e=>{t.$b(`Sub`,e,void 0)},976362:e=>{t.$b(`Mul`,e,void 0)},976413:e=>{t.$b(`Div`,e,void 0)},976464:e=>{t.$b(`Pow`,e,void 0)},976515:e=>{t.$b(`Equal`,e,void 0)},976568:e=>{t.$b(`Greater`,e,void 0)},976623:e=>{t.$b(`GreaterOrEqual`,e,void 0)},976685:e=>{t.$b(`Less`,e,void 0)},976737:e=>{t.$b(`LessOrEqual`,e,void 0)},976796:(e,n,r,i,a)=>{t.$b(`ReduceMean`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},976971:(e,n,r,i,a)=>{t.$b(`ReduceMax`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},977145:(e,n,r,i,a)=>{t.$b(`ReduceMin`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},977319:(e,n,r,i,a)=>{t.$b(`ReduceProd`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},977494:(e,n,r,i,a)=>{t.$b(`ReduceSum`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},977668:(e,n,r,i,a)=>{t.$b(`ReduceL1`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},977841:(e,n,r,i,a)=>{t.$b(`ReduceL2`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},978014:(e,n,r,i,a)=>{t.$b(`ReduceLogSum`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},978191:(e,n,r,i,a)=>{t.$b(`ReduceSumSquare`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},978371:(e,n,r,i,a)=>{t.$b(`ReduceLogSumExp`,e,{keepDims:!!n,noopWithEmptyAxes:!!r,axes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},978551:e=>{t.$b(`Where`,e,void 0)},978604:(e,n,r)=>{t.$b(`Transpose`,e,{perm:n?Array.from((w(),D).subarray(Number(n)>>>0,Number(r)>>>0)):[]})},978728:(e,n,r,i)=>{t.$b(`DepthToSpace`,e,{blocksize:n,mode:A(r),format:i?`NHWC`:`NCHW`})},978861:(e,n,r,i)=>{t.$b(`DepthToSpace`,e,{blocksize:n,mode:A(r),format:i?`NHWC`:`NCHW`})},978994:(e,n,r,i,a,o,s,c,l,u,d,f,p,m,h)=>{t.$b(`ConvTranspose`,e,{format:l?`NHWC`:`NCHW`,autoPad:n,dilations:[r],group:i,kernelShape:[a],pads:[o,s],strides:[c],wIsConst:()=>!!(w(),T)[u>>>0],outputPadding:d?Array.from((w(),D).subarray(Number(d)>>>0,Number(f)>>>0)):[],outputShape:p?Array.from((w(),D).subarray(Number(p)>>>0,Number(m)>>>0)):[],activation:A(h)})},979427:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`ConvTranspose`,e,{format:c?`NHWC`:`NCHW`,autoPad:n,dilations:Array.from((w(),D).subarray(Number(r)>>>0,2+(Number(r)>>>0)>>>0)),group:i,kernelShape:Array.from((w(),D).subarray(Number(a)>>>0,2+(Number(a)>>>0)>>>0)),pads:Array.from((w(),D).subarray(Number(o)>>>0,4+(Number(o)>>>0)>>>0)),strides:Array.from((w(),D).subarray(Number(s)>>>0,2+(Number(s)>>>0)>>>0)),wIsConst:()=>!!(w(),T)[l>>>0],outputPadding:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],outputShape:f?Array.from((w(),D).subarray(Number(f)>>>0,Number(p)>>>0)):[],activation:A(m)})},980088:(e,n,r,i,a,o,s,c,l,u,d,f,p,m,h)=>{t.$b(`ConvTranspose`,e,{format:l?`NHWC`:`NCHW`,autoPad:n,dilations:[r],group:i,kernelShape:[a],pads:[o,s],strides:[c],wIsConst:()=>!!(w(),T)[u>>>0],outputPadding:d?Array.from((w(),D).subarray(Number(d)>>>0,Number(f)>>>0)):[],outputShape:p?Array.from((w(),D).subarray(Number(p)>>>0,Number(m)>>>0)):[],activation:A(h)})},980521:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`ConvTranspose`,e,{format:c?`NHWC`:`NCHW`,autoPad:n,dilations:Array.from((w(),D).subarray(Number(r)>>>0,2+(Number(r)>>>0)>>>0)),group:i,kernelShape:Array.from((w(),D).subarray(Number(a)>>>0,2+(Number(a)>>>0)>>>0)),pads:Array.from((w(),D).subarray(Number(o)>>>0,4+(Number(o)>>>0)>>>0)),strides:Array.from((w(),D).subarray(Number(s)>>>0,2+(Number(s)>>>0)>>>0)),wIsConst:()=>!!(w(),T)[l>>>0],outputPadding:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],outputShape:f?Array.from((w(),D).subarray(Number(f)>>>0,Number(p)>>>0)):[],activation:A(m)})},981182:(e,n)=>{t.$b(`GlobalAveragePool`,e,{format:n?`NHWC`:`NCHW`})},981273:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`AveragePool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),D).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),D).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),D).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},981752:(e,n)=>{t.$b(`GlobalAveragePool`,e,{format:n?`NHWC`:`NCHW`})},981843:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`AveragePool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),D).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),D).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),D).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},982322:(e,n)=>{t.$b(`GlobalMaxPool`,e,{format:n?`NHWC`:`NCHW`})},982409:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`MaxPool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),D).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),D).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),D).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},982884:(e,n)=>{t.$b(`GlobalMaxPool`,e,{format:n?`NHWC`:`NCHW`})},982971:(e,n,r,i,a,o,s,c,l,u,d,f,p,m)=>{t.$b(`MaxPool`,e,{format:m?`NHWC`:`NCHW`,auto_pad:n,ceil_mode:r,count_include_pad:i,storage_order:a,dilations:o?Array.from((w(),D).subarray(Number(o)>>>0,Number(s)>>>0)):[],kernel_shape:c?Array.from((w(),D).subarray(Number(c)>>>0,Number(l)>>>0)):[],pads:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],strides:f?Array.from((w(),D).subarray(Number(f)>>>0,Number(p)>>>0)):[]})},983446:(e,n,r,i,a)=>{t.$b(`Gemm`,e,{alpha:n,beta:r,transA:i,transB:a})},983550:e=>{t.$b(`MatMul`,e,void 0)},983604:(e,n,r,i)=>{t.$b(`ArgMax`,e,{keepDims:!!n,selectLastIndex:!!r,axis:i})},983712:(e,n,r,i)=>{t.$b(`ArgMin`,e,{keepDims:!!n,selectLastIndex:!!r,axis:i})},983820:(e,n)=>{t.$b(`Softmax`,e,{axis:n})},983883:(e,n)=>{t.$b(`Concat`,e,{axis:n})},983943:(e,n,r,i,a)=>{t.$b(`Split`,e,{axis:n,numOutputs:r,splitSizes:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},984099:e=>{t.$b(`Expand`,e,void 0)},984153:(e,n)=>{t.$b(`Gather`,e,{axis:Number(n)})},984224:(e,n)=>{t.$b(`GatherElements`,e,{axis:Number(n)})},984303:(e,n)=>{t.$b(`GatherND`,e,{batch_dims:Number(n)})},984382:(e,n,r,i,a,o,s,c,l,u,d)=>{t.$b(`Resize`,e,{antialias:n,axes:r?Array.from((w(),D).subarray(Number(r)>>>0,Number(i)>>>0)):[],coordinateTransformMode:A(a),cubicCoeffA:o,excludeOutside:s,extrapolationValue:c,keepAspectRatioPolicy:A(l),mode:A(u),nearestMode:A(d)})},984744:(e,n,r,i,a,o,s)=>{t.$b(`Slice`,e,{starts:n?Array.from((w(),D).subarray(Number(n)>>>0,Number(r)>>>0)):[],ends:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[],axes:o?Array.from((w(),D).subarray(Number(o)>>>0,Number(s)>>>0)):[]})},985008:e=>{t.$b(`Tile`,e,void 0)},985060:(e,n,r)=>{t.$b(`InstanceNormalization`,e,{epsilon:n,format:r?`NHWC`:`NCHW`})},985174:(e,n,r)=>{t.$b(`InstanceNormalization`,e,{epsilon:n,format:r?`NHWC`:`NCHW`})},985288:e=>{t.$b(`Range`,e,void 0)},985341:(e,n)=>{t.$b(`Einsum`,e,{equation:A(n)})},985422:(e,n,r,i,a)=>{t.$b(`Pad`,e,{mode:n,value:r,pads:i?Array.from((w(),D).subarray(Number(i)>>>0,Number(a)>>>0)):[]})},985565:(e,n,r,i,a,o)=>{t.$b(`BatchNormalization`,e,{epsilon:n,momentum:r,spatial:!!a,trainingMode:!!i,format:o?`NHWC`:`NCHW`})},985734:(e,n,r,i,a,o)=>{t.$b(`BatchNormalization`,e,{epsilon:n,momentum:r,spatial:!!a,trainingMode:!!i,format:o?`NHWC`:`NCHW`})},985903:(e,n,r)=>{t.$b(`CumSum`,e,{exclusive:Number(n),reverse:Number(r)})},986e3:(e,n,r)=>{t.$b(`DequantizeLinear`,e,{axis:n,blockSize:r})},986090:(e,n,r,i,a)=>{t.$b(`GridSample`,e,{align_corners:n,mode:A(r),padding_mode:A(i),format:a?`NHWC`:`NCHW`})},986260:(e,n,r,i,a)=>{t.$b(`GridSample`,e,{align_corners:n,mode:A(r),padding_mode:A(i),format:a?`NHWC`:`NCHW`})},986430:(e,n)=>{t.$b(`ScatterND`,e,{reduction:A(n)})},986515:(e,n,r,i,a,o,s,c,l)=>{t.$b(`Attention`,e,{numHeads:n,isUnidirectional:r,maskFilterValue:i,scale:a,doRotary:o,qkvHiddenSizes:s?Array.from((w(),D).subarray(Number(c)>>>0,Number(c)+s>>>0)):[],pastPresentShareBuffer:!!l})},986787:e=>{t.$b(`BiasAdd`,e,void 0)},986842:e=>{t.$b(`BiasSplitGelu`,e,void 0)},986903:e=>{t.$b(`FastGelu`,e,void 0)},986959:(e,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)=>{t.$b(`Conv`,e,{format:f?`NHWC`:`NCHW`,auto_pad:n,dilations:r?Array.from((w(),D).subarray(Number(r)>>>0,Number(i)>>>0)):[],group:a,kernel_shape:o?Array.from((w(),D).subarray(Number(o)>>>0,Number(s)>>>0)):[],pads:c?Array.from((w(),D).subarray(Number(c)>>>0,Number(l)>>>0)):[],strides:u?Array.from((w(),D).subarray(Number(u)>>>0,Number(d)>>>0)):[],w_is_const:()=>!!(w(),T)[Number(p)>>>0],activation:A(m),activation_params:h?Array.from((w(),re).subarray(Number(h)>>>0,Number(g)>>>0)):[]})},987543:e=>{t.$b(`Gelu`,e,void 0)},987595:(e,n,r,i,a,o,s,c,l)=>{t.$b(`GroupQueryAttention`,e,{numHeads:n,kvNumHeads:r,scale:i,softcap:a,doRotary:o,rotaryInterleaved:s,smoothSoftmax:c,localWindowSize:l})},987812:(e,n,r,i)=>{t.$b(`LayerNormalization`,e,{axis:n,epsilon:r,simplified:!!i})},987923:(e,n,r,i)=>{t.$b(`LayerNormalization`,e,{axis:n,epsilon:r,simplified:!!i})},988034:(e,n,r,i,a,o)=>{t.$b(`MatMulNBits`,e,{k:n,n:r,accuracyLevel:i,bits:a,blockSize:o})},988161:(e,n,r,i,a,o)=>{t.$b(`MultiHeadAttention`,e,{numHeads:n,isUnidirectional:r,maskFilterValue:i,scale:a,doRotary:o})},988320:(e,n)=>{t.$b(`QuickGelu`,e,{alpha:n})},988384:(e,n,r,i,a)=>{t.$b(`RotaryEmbedding`,e,{interleaved:!!n,numHeads:r,rotaryEmbeddingDim:i,scale:a})},988523:(e,n,r)=>{t.$b(`SkipLayerNormalization`,e,{epsilon:n,simplified:!!r})},988625:(e,n,r)=>{t.$b(`SkipLayerNormalization`,e,{epsilon:n,simplified:!!r})},988727:(e,n,r,i)=>{t.$b(`GatherBlockQuantized`,e,{gatherAxis:n,quantizeAxis:r,blockSize:i})},988848:e=>{t.Fd(e)},988882:(e,n)=>t.Hd(Number(e),Number(n),t.Yc.Kd,t.Yc.errors)};function yi(e,n,r){return ln(async()=>{await t.Dd(Number(e),Number(n),Number(r))})}function bi(){return typeof wasmOffsetConverter<`u`}function xi(e,t,n,r){var i=X();try{return zr(e,t,n,r)}catch(e){if(Y(i),e!==e+0)throw e;J(1,0)}}function Si(e,t,n){var r=X();try{return Fr(e,t,n)}catch(e){if(Y(r),e!==e+0)throw e;J(1,0)}}function Ci(e){var t=X();try{Mr(e)}catch(e){if(Y(t),e!==e+0)throw e;J(1,0)}}function wi(e,t){var n=X();try{return jr(e,t)}catch(e){if(Y(n),e!==e+0)throw e;J(1,0)}}function Ti(e,t,n){var r=X();try{Ar(e,t,n)}catch(e){if(Y(r),e!==e+0)throw e;J(1,0)}}function Ei(e,t){var n=X();try{Br(e,t)}catch(e){if(Y(n),e!==e+0)throw e;J(1,0)}}function Di(e,t,n,r,i,a,o){var s=X();try{return Lr(e,t,n,r,i,a,o)}catch(e){if(Y(s),e!==e+0)throw e;J(1,0)}}function Oi(e,t,n,r,i,a){var o=X();try{Nr(e,t,n,r,i,a)}catch(e){if(Y(o),e!==e+0)throw e;J(1,0)}}function ki(e,t,n,r){var i=X();try{Rr(e,t,n,r)}catch(e){if(Y(i),e!==e+0)throw e;J(1,0)}}function Ai(e,t,n,r,i){var a=X();try{Pr(e,t,n,r,i)}catch(e){if(Y(a),e!==e+0)throw e;J(1,0)}}function ji(e,t,n,r,i,a,o){var s=X();try{Hr(e,t,n,r,i,a,o)}catch(e){if(Y(s),e!==e+0)throw e;J(1,0)}}function Mi(e,t,n,r,i,a,o){var s=X();try{Ur(e,t,n,r,i,a,o)}catch(e){if(Y(s),e!==e+0)throw e;J(1,0)}}function Ni(e,t,n,r,i,a,o,s){var c=X();try{qr(e,t,n,r,i,a,o,s)}catch(e){if(Y(c),e!==e+0)throw e;J(1,0)}}function Pi(e,t,n,r,i){var a=X();try{return Vr(e,t,n,r,i)}catch(e){if(Y(a),e!==e+0)throw e;J(1,0)}}function Fi(e,t,n){var r=X();try{return Jr(e,t,n)}catch(e){if(Y(r),e!==e+0)throw e;J(1,0)}}function Ii(e,t,n,r,i,a,o,s){var c=X();try{Yr(e,t,n,r,i,a,o,s)}catch(e){if(Y(c),e!==e+0)throw e;J(1,0)}}function Li(e,t,n,r,i,a,o,s,c,l,u,d){var f=X();try{Wr(e,t,n,r,i,a,o,s,c,l,u,d)}catch(e){if(Y(f),e!==e+0)throw e;J(1,0)}}function Ri(e,t,n,r,i,a){var o=X();try{return Gr(e,t,n,r,i,a)}catch(e){if(Y(o),e!==e+0)throw e;J(1,0)}}function zi(e,t,n){var r=X();try{return Xr(e,t,n)}catch(e){if(Y(r),e!==e+0)throw e;return J(1,0),0n}}function Bi(e,t,n,r,i,a,o,s,c){var l=X();try{Ir(e,t,n,r,i,a,o,s,c)}catch(e){if(Y(l),e!==e+0)throw e;J(1,0)}}function Vi(e){var t=X();try{return Zr(e)}catch(e){if(Y(t),e!==e+0)throw e;J(1,0)}}function Hi(e,t){var n=X();try{return di(e,t)}catch(e){if(Y(n),e!==e+0)throw e;return J(1,0),0n}}function Ui(e){var t=X();try{return Qr(e)}catch(e){if(Y(t),e!==e+0)throw e;return J(1,0),0n}}function Wi(e,t,n,r){var i=X();try{return ii(e,t,n,r)}catch(e){if(Y(i),e!==e+0)throw e;J(1,0)}}function Gi(e,t,n,r,i){var a=X();try{return Z(e,t,n,r,i)}catch(e){if(Y(a),e!==e+0)throw e;J(1,0)}}function Ki(e,t,n,r,i,a){var o=X();try{return ai(e,t,n,r,i,a)}catch(e){if(Y(o),e!==e+0)throw e;J(1,0)}}function qi(e,t,n,r,i,a){var o=X();try{return oi(e,t,n,r,i,a)}catch(e){if(Y(o),e!==e+0)throw e;J(1,0)}}function Ji(e,t,n,r,i,a,o,s){var c=X();try{return Kr(e,t,n,r,i,a,o,s)}catch(e){if(Y(c),e!==e+0)throw e;J(1,0)}}function Yi(e,t,n,r,i){var a=X();try{return si(e,t,n,r,i)}catch(e){if(Y(a),e!==e+0)throw e;return J(1,0),0n}}function Xi(e,t,n,r){var i=X();try{return ci(e,t,n,r)}catch(e){if(Y(i),e!==e+0)throw e;J(1,0)}}function Zi(e,t,n,r){var i=X();try{return li(e,t,n,r)}catch(e){if(Y(i),e!==e+0)throw e;J(1,0)}}function Qi(e,t,n,r,i,a,o,s,c,l,u,d){var f=X();try{return ui(e,t,n,r,i,a,o,s,c,l,u,d)}catch(e){if(Y(f),e!==e+0)throw e;J(1,0)}}function $i(e,t,n,r,i,a,o,s,c,l,u){var d=X();try{ni(e,t,n,r,i,a,o,s,c,l,u)}catch(e){if(Y(d),e!==e+0)throw e;J(1,0)}}function ea(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){var g=X();try{ri(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}catch(e){if(Y(g),e!==e+0)throw e;J(1,0)}}function ta(e,t,n){var r=X();try{return $r(e,t,n)}catch(e){if(Y(r),e!==e+0)throw e;J(1,0)}}function na(e,t,n){var r=X();try{return ei(e,t,n)}catch(e){if(Y(r),e!==e+0)throw e;J(1,0)}}function ra(e,t,n,r){var i=X();try{ti(e,t,n,r)}catch(e){if(Y(i),e!==e+0)throw e;J(1,0)}}function ia(){if(0<_e)ve=ia;else if(i)h?.(t),ue();else{for(var e=ge;0<e.length;)e.shift()(t);0<_e?ve=ia:(t.calledRun=!0,S||(ue(),h?.(t)))}}return i||(gi=await pe(),ia()),t.PTR_SIZE=4,ce?t:new Promise((e,t)=>{h=e,g=t})}var Be,Ve,He=o(()=>{Be=ze,Ve=globalThis.self?.name?.startsWith(`em-pthread`),Ve&&ze()}),Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,A,tt,nt=o(()=>{Me(),Ue=typeof location>`u`?void 0:location.origin,We=import.meta.url>`file:`&&import.meta.url<`file;`,Ge=()=>We?new URL(new URL(`ort.bundle.min.mjs`,import.meta.url).href,Ue).href:import.meta.url,Ke=Ge(),qe=()=>{if(Ke&&!Ke.startsWith(`blob:`))return Ke.substring(0,Ke.lastIndexOf(`/`)+1)},Je=(e,t)=>{try{let n=t??Ke;return(n?new URL(e,n):new URL(e)).origin===Ue}catch{return!1}},Ye=(e,t)=>{let n=t??Ke;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},Xe=(e,t)=>`${t??`./`}${e}`,Ze=async e=>{let t=await(await fetch(e,{credentials:`same-origin`})).blob();return URL.createObjectURL(t)},Qe=async e=>(await import(e)).default,$e=(Le(),l(Ne)).default,et=async()=>{if(!Ke)throw Error(`Failed to load proxy worker: cannot determine the script source URL.`);if(Je(Ke))return[void 0,$e()];let e=await Ze(Ke);return[e,$e(e)]},A=(He(),l(Re)).default,tt=async(e,t,n,r)=>{let i=A&&!(e||t);if(i)if(Ke)i=Je(Ke)||r&&!n;else if(r&&!n)i=!0;else throw Error(`cannot determine the script source URL.`);if(i)return[void 0,A];{let r=`ort-wasm-simd-threaded.jsep.mjs`,i=e??Ye(r,t),a=n&&i&&!Je(i,t),o=a?await Ze(i):i??Xe(r,t);return[a?o:void 0,await Qe(o)]}}}),rt,j,it,M,at,ot,st,ct,N,P=o(()=>{nt(),j=!1,it=!1,M=!1,at=()=>{if(typeof SharedArrayBuffer>`u`)return!1;try{return typeof MessageChannel<`u`&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},ot=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},st=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ct=async e=>{if(j)return Promise.resolve();if(it)throw Error(`multiple calls to 'initializeWebAssembly()' detected.`);if(M)throw Error(`previous call to 'initializeWebAssembly()' failed.`);it=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd===`relaxed`){if(!st())throw Error(`Relaxed WebAssembly SIMD is not supported in the current environment.`)}else if(!ot())throw Error(`WebAssembly SIMD is not supported in the current environment.`)}let r=at();n>1&&!r&&(typeof self<`u`&&!self.crossOriginIsolated&&console.warn(`env.wasm.numThreads is set to `+n+`, but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info.`),console.warn(`WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading.`),e.numThreads=n=1);let i=e.wasmPaths,a=typeof i==`string`?i:void 0,o=i?.mjs,s=o?.href??o,c=i?.wasm,l=c?.href??c,u=e.wasmBinary,[d,f]=await tt(s,a,n>1,!!u||!!l),p=!1,m=[];if(t>0&&m.push(new Promise(e=>{setTimeout(()=>{p=!0,e()},t)})),m.push(new Promise((e,t)=>{let r={numThreads:n};if(u)r.wasmBinary=u,r.locateFile=e=>e;else if(l||a)r.locateFile=e=>l??a+e;else if(s&&s.indexOf(`blob:`)!==0)r.locateFile=e=>new URL(e,s).href;else if(d){let e=qe();e&&(r.locateFile=t=>e+t)}f(r).then(t=>{it=!1,j=!0,rt=t,e(),d&&URL.revokeObjectURL(d)},e=>{it=!1,M=!0,t(e)})})),await Promise.race(m),p)throw Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},N=()=>{if(j&&rt)return rt;throw Error(`WebAssembly is not initialized yet.`)}}),lt,ut,F,dt=o(()=>{P(),lt=(e,t)=>{let n=N(),r=n.lengthBytesUTF8(e)+1,i=n._malloc(r);return n.stringToUTF8(e,i,r),t.push(i),i},ut=(e,t,n,r)=>{if(typeof e==`object`&&e){if(n.has(e))throw Error(`Circular reference in options`);n.add(e)}Object.entries(e).forEach(([e,i])=>{let a=t?t+e:e;if(typeof i==`object`)ut(i,a+`.`,n,r);else if(typeof i==`string`||typeof i==`number`)r(a,i.toString());else if(typeof i==`boolean`)r(a,i?`1`:`0`);else throw Error(`Can't handle extra config type: ${typeof i}`)})},F=e=>{let t=N(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetLastError(r,r+n);let i=Number(t.getValue(r,n===4?`i32`:`i64`)),a=t.getValue(r+n,`*`),o=a?t.UTF8ToString(a):``;throw Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(n)}}}),ft,pt=o(()=>{P(),dt(),ft=e=>{let t=N(),n=0,r=[],i=e||{};try{if(e?.logSeverityLevel===void 0)i.logSeverityLevel=2;else if(typeof e.logSeverityLevel!=`number`||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)i.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!=`number`||!Number.isInteger(e.logVerbosityLevel))throw Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(i.terminate=!1);let a=0;return e?.tag!==void 0&&(a=lt(e.tag,r)),n=t._OrtCreateRunOptions(i.logSeverityLevel,i.logVerbosityLevel,!!i.terminate,a),n===0&&F(`Can't create run options.`),e?.extra!==void 0&&ut(e.extra,``,new WeakSet,(e,i)=>{let a=lt(e,r),o=lt(i,r);t._OrtAddRunConfigEntry(n,a,o)!==0&&F(`Can't set a run config entry: ${e} - ${i}.`)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseRunOptions(n),r.forEach(e=>t._free(e)),e}}}),mt,ht,gt,_t,vt,yt,bt=o(()=>{P(),dt(),mt=e=>{switch(e){case`disabled`:return 0;case`basic`:return 1;case`extended`:return 2;case`layout`:return 3;case`all`:return 99;default:throw Error(`unsupported graph optimization level: ${e}`)}},ht=e=>{switch(e){case`sequential`:return 0;case`parallel`:return 1;default:throw Error(`unsupported execution mode: ${e}`)}},gt=e=>{e.extra||={},e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||=`1`,e.executionProviders&&e.executionProviders.some(e=>(typeof e==`string`?e:e.name)===`webgpu`)&&(e.enableMemPattern=!1)},_t=(e,t,n,r)=>{let i=lt(t,r),a=lt(n,r);N()._OrtAddSessionConfigEntry(e,i,a)!==0&&F(`Can't set a session config entry: ${t} - ${n}.`)},vt=async(e,t,n)=>{let r=t.executionProviders;for(let t of r){let r=typeof t==`string`?t:t.name,i=[];switch(r){case`webnn`:if(r=`WEBNN`,_t(e,`session.disable_quant_qdq`,`1`,n),_t(e,`session.disable_qdq_constant_folding`,`1`,n),typeof t!=`string`){let r=t?.deviceType;r&&_t(e,`deviceType`,r,n)}break;case`webgpu`:if(r=`JS`,typeof t!=`string`){let r=t;if(r?.preferredLayout){if(r.preferredLayout!==`NCHW`&&r.preferredLayout!==`NHWC`)throw Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${r.preferredLayout}`);_t(e,`preferredLayout`,r.preferredLayout,n)}}break;case`wasm`:case`cpu`:continue;default:throw Error(`not supported execution provider: ${r}`)}let a=lt(r,n),o=i.length,s=0,c=0;if(o>0){s=N()._malloc(o*N().PTR_SIZE),n.push(s),c=N()._malloc(o*N().PTR_SIZE),n.push(c);for(let e=0;e<o;e++)N().setValue(s+e*N().PTR_SIZE,i[e][0],`*`),N().setValue(c+e*N().PTR_SIZE,i[e][1],`*`)}await N()._OrtAppendExecutionProvider(e,a,s,c,o)!==0&&F(`Can't append execution provider: ${r}.`)}},yt=async e=>{let t=N(),n=0,r=[],i=e||{};gt(i);try{let e=mt(i.graphOptimizationLevel??`all`),a=ht(i.executionMode??`sequential`),o=typeof i.logId==`string`?lt(i.logId,r):0,s=i.logSeverityLevel??2;if(!Number.isInteger(s)||s<0||s>4)throw Error(`log severity level is not valid: ${s}`);let c=i.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw Error(`log verbosity level is not valid: ${c}`);let l=typeof i.optimizedModelFilePath==`string`?lt(i.optimizedModelFilePath,r):0;if(n=t._OrtCreateSessionOptions(e,!!i.enableCpuMemArena,!!i.enableMemPattern,a,!!i.enableProfiling,0,o,s,c,l),n===0&&F(`Can't create session options.`),i.executionProviders&&await vt(n,i,r),i.enableGraphCapture!==void 0){if(typeof i.enableGraphCapture!=`boolean`)throw Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);_t(n,`enableGraphCapture`,i.enableGraphCapture.toString(),r)}if(i.freeDimensionOverrides)for(let[e,a]of Object.entries(i.freeDimensionOverrides)){if(typeof e!=`string`)throw Error(`free dimension override name must be a string: ${e}`);if(typeof a!=`number`||!Number.isInteger(a)||a<0)throw Error(`free dimension override value must be a non-negative integer: ${a}`);let i=lt(e,r);t._OrtAddFreeDimensionOverride(n,i,a)!==0&&F(`Can't set a free dimension override: ${e} - ${a}.`)}return i.extra!==void 0&&ut(i.extra,``,new WeakSet,(e,t)=>{_t(n,e,t,r)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&F(`Can't release session options.`),r.forEach(e=>t._free(e)),e}}}),xt,St,Ct,wt,Tt,Et,Dt,Ot,I=o(()=>{xt=e=>{switch(e){case`int8`:return 3;case`uint8`:return 2;case`bool`:return 9;case`int16`:return 5;case`uint16`:return 4;case`int32`:return 6;case`uint32`:return 12;case`float16`:return 10;case`float32`:return 1;case`float64`:return 11;case`string`:return 8;case`int64`:return 7;case`uint64`:return 13;case`int4`:return 22;case`uint4`:return 21;default:throw Error(`unsupported data type: ${e}`)}},St=e=>{switch(e){case 3:return`int8`;case 2:return`uint8`;case 9:return`bool`;case 5:return`int16`;case 4:return`uint16`;case 6:return`int32`;case 12:return`uint32`;case 10:return`float16`;case 1:return`float32`;case 11:return`float64`;case 8:return`string`;case 7:return`int64`;case 13:return`uint64`;case 22:return`int4`;case 21:return`uint4`;default:throw Error(`unsupported data type: ${e}`)}},Ct=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],r=typeof t==`number`?t:t.reduce((e,t)=>e*t,1);return n>0?Math.ceil(r*n):void 0},wt=e=>{switch(e){case`float16`:return typeof Float16Array<`u`&&Float16Array.from?Float16Array:Uint16Array;case`float32`:return Float32Array;case`uint8`:return Uint8Array;case`int8`:return Int8Array;case`uint16`:return Uint16Array;case`int16`:return Int16Array;case`int32`:return Int32Array;case`bool`:return Uint8Array;case`float64`:return Float64Array;case`uint32`:return Uint32Array;case`int64`:return BigInt64Array;case`uint64`:return BigUint64Array;default:throw Error(`unsupported type: ${e}`)}},Tt=e=>{switch(e){case`verbose`:return 0;case`info`:return 1;case`warning`:return 2;case`error`:return 3;case`fatal`:return 4;default:throw Error(`unsupported logging level: ${e}`)}},Et=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,Dt=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint64`||e===`int8`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,Ot=e=>{switch(e){case`none`:return 0;case`cpu`:return 1;case`cpu-pinned`:return 2;case`texture`:return 3;case`gpu-buffer`:return 4;case`ml-tensor`:return 5;default:throw Error(`unsupported data location: ${e}`)}}}),kt,At=o(()=>{Me(),kt=async e=>{if(typeof e==`string`){let t=await fetch(e);if(!t.ok)throw Error(`failed to load external data file: ${e}`);let n=t.headers.get(`Content-Length`),r=n?parseInt(n,10):0;if(r<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(r)}catch(e){if(e instanceof RangeError){let e=Math.ceil(r/65536);i=new WebAssembly.Memory({initial:e,maximum:e}).buffer}else throw e}let a=0;for(;;){let{done:e,value:t}=await n.read();if(e)break;let r=t.byteLength;new Uint8Array(i,a,r).set(t),a+=r}return new Uint8Array(i,0,r)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),jt,Mt,Nt,Pt,Ft,It,L,Lt=o(()=>{I(),jt=[`V`,`I`,`W`,`E`,`F`],Mt=(e,t)=>{console.log(`[${jt[e]},${new Date().toISOString()}]${t}`)},Ft=(e,t)=>{Nt=e,Pt=t},It=(e,t)=>{let n=Tt(e);n>=Tt(Nt)&&Mt(n,typeof t==`function`?t():t)},L=(...e)=>{Pt&&It(...e)}}),Rt,zt,R,Bt,Vt,Ht,Ut,z=o(()=>{Rt=class{static calcMatMulShape(e,t){return e[1]===t[0]?[e[0],t[1]]:void 0}},zt=class{static calcShape(e,t,n=!1){let r=e.length,i=t.length;if(r===0)return t;if(i===0)return e;let a=Math.max(e.length,t.length),o=Array(a);if(n){if(r<2||i<2)return;let n=Rt.calcMatMulShape([e[r-2],e[r-1]],[t[i-2],t[i-1]]);if(n===void 0)return;[o[a-2],o[a-1]]=n}for(let s=n?3:1;s<=a;s++){let n=r-s<0?1:e[r-s],c=i-s<0?1:t[i-s];if(n!==c&&n>1&&c>1)return;let l=Math.max(n,c);if(n&&c)o[a-s]=Math.max(n,c);else{if(l>1)return;o[a-s]=0}}return o}static isValidBroadcast(e,t){let n=e.length,r=t.length;if(n>r)return!1;for(let i=1;i<=n;i++)if(e[n-i]!==1&&e[n-i]!==t[r-i])return!1;return!0}},R=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static convertShape(e,t=4){let n=e.length;if(n===0)return[];let r=Array(n),i=n-1;for(;i>=0;){if(e[i]%t===0){r[i]=e[i]/t;break}if(t%e[i]!==0)throw Error(`cannot convert shape`);r[i]=1,t/=e[i],i--}for(i--;i>=0;i--)r[i]=e[i];return r}static sizeFromDimension(t,n){if(n<0||n>t.length)throw Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(e,t,n){let r=1;for(let i=t;i<n;i++){if(e[i]<0)throw Error(`cannot get valid size from specified dimension range. Most likely the range contains negative values in them.`);r*=Number(e[i])}return r}static computeStrides(e){let t=e.length;if(t===0)return[];if(t===1)return[1];let n=Array(t);n[t-1]=1,n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}static normalizeAxis(e,t){if(e<-t&&e>=t)throw Error(`unsupported axis for this operation.`);return e<0?e+t:e}static normalizeAxes(e,t){return e.map(n=>this.normalizeAxis(n,t??e.length))}static sortBasedOnPerm(e,t){return t?t.map(t=>e[t]):e.slice().reverse()}static padShape(e,t){let n=e.length;return e.map((e,r)=>e+t[r]+t[r+n])}static areEqual(e,t){return e.length===t.length?e.every((e,n)=>e===t[n]):!1}},Bt=class e{static adjustPoolAttributes(e,t,n,r,i,a){if(!e&&n.length!==t.length-2)throw Error(`length of specified kernel shapes should be 2 less than length of input dimensions`);if(e)for(let e=0;e<t.length-2;e++)e>=n.length?n.push(t[e+2]):n[e]=t[e+2];for(let e=0;e<n.length;e++)if(e<r.length){if(r[e]<0)throw Error(`strides should be greater than or equal to 1`)}else r.push(1);for(let e=0;e<n.length;e++)if(e<i.length){if(i[e]<0)throw Error(`dilations should be greater than or equal to 1`)}else i.push(1);for(let e=0;e<n.length*2;e++)if(e<a.length){if(a[e]<0)throw Error(`pad should be greater than or equal to 1`)}else a.push(0);for(let e=0;e<n.length;e++){if(n[e]<=0)throw Error(`kernel shapes need to be greater than 0`);if(a[e]>=n[e]||a[e+n.length]>=n[e])throw Error(`pads should be smaller than kernel`)}}static adjustPadsBasedOnAutoPad(t,n,r,i,a,o,s){if(s){if(a.length!==2*(t.length-2))throw Error(`length of pads should be twice the length of data dimensions`);if(n.length!==t.length-2)throw Error(`length of strides should be the length of data dimensions`);if(i.length!==t.length-2)throw Error(`length of kernel shapes should be the length of data dimensions`);for(let c=0;c<t.length-2;c++)e.adjustPadAndReturnShape(t[c+(o?1:2)],n[c],r[c],i[c],a,c,c+t.length-2,s)}}static computePoolOutputShape(t,n,r,i,a,o,s){if(n.length<=0)throw Error(`input shape must be of size greater than 0`);let c=[n[0],n[1]];return e.computeShapeHelper(t,n,c,r,i,a,o,s),c}static computeConvOutputShape(t,n,r,i,a,o,s){if(t.length<=0||n.length<=0)throw Error(`invalid input tensor dims or invalid filter tensor dims`);let c=[t[0],n[0]];return e.computeShapeHelper(!1,t,c,r,i,a,o,s),c}static computeShapeHelper(t,n,r,i,a,o,s,c){if(t)for(let e=0;e<n.length-2;e++)r.push(1);else for(let t=0;t<n.length-2;t++)r.push(e.adjustPadAndReturnShape(n[t+2],i[t],a[t],o[t],s,t,t+n.length-2,c))}static adjustPadAndReturnShape(e,t,n,r,i,a,o,s){let c=n*(r-1)+1;if(s&&s!==`NOTSET`)switch(s){case`VALID`:return i[a]=0,i[o]=0,Math.floor((e-c)/t+1);case`SAME_LOWER`:case`SAME_UPPER`:if(n!==1)throw Error(`Dilation not supported for SAME_UPPER or SAME_LOWER`);{let n=((e+t-1)/t-1)*t+r-e;return i[a]=Math.floor(s===`SAME_LOWER`?(n+1)/2:n/2),i[o]=n-i[a],Math.floor((e+n-r)/t+1)}default:throw Error(`Unsupported AutoPad type`)}else return Math.floor((e+i[a]+i[o]-c)/t+1)}},Vt=class{static getShapeOfGemmResult(e,t,n,r,i){if(e.length!==2||n.length!==2)throw Error(`shape need to be of size 2`);let a,o,s;t?(a=e[1],o=e[0]):(a=e[0],o=e[1]);let c=-1;if(r?(s=n[0],c=1):(s=n[1],c=0),n[c]!==o)throw Error(`dimension mismatch`);if(a<=0||s<=0||o<=0)throw Error(`invalid shape specified`);if(i&&!zt.isValidBroadcast(i,[a,s]))throw Error(`gemm: invalid bias shape for broadcast`);return[a,s,o]}},Ht=-34028234663852886e22,Ut=34028234663852886e22}),Wt,Gt=o(()=>{I(),Wt=(e,t)=>new(wt(t))(e)}),Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn=o(()=>{I(),Lt(),Kt=new Map([[`float32`,32],[`float16`,16],[`int32`,32],[`uint32`,32],[`int64`,64],[`uint64`,64],[`int8`,8],[`uint8`,8],[`int4`,4],[`uint4`,4]]),qt=(e,t)=>{if(t===`int32`)return e;let n=Kt.get(t);if(!n)throw Error(`WebNN backend does not support data type: ${t}`);let r=n/8;if(e.byteLength%r!==0)throw Error(`Invalid Uint8Array length - must be a multiple of ${r}.`);let i=e.byteLength/r,a=new(wt(t))(e.buffer,e.byteOffset,i);switch(t){case`int64`:case`uint64`:{let e=new Int32Array(i);for(let t=0;t<i;t++){let n=a[t];if(n>2147483647n||n<-2147483648n)throw Error(`Can not convert int64 data to int32 - value out of range.`);e[t]=Number(n)}return new Uint8Array(e.buffer)}case`int8`:case`uint8`:case`uint32`:{if(t===`uint32`&&a.some(e=>e>2147483647))throw Error(`Can not convert uint32 data to int32 - value out of range.`);let e=Int32Array.from(a,Number);return new Uint8Array(e.buffer)}default:throw Error(`Unsupported data conversion from ${t} to 'int32'`)}},Jt=(e,t)=>{if(t===`int32`)return e;if(e.byteLength%4!=0)throw Error(`Invalid Uint8Array length - must be a multiple of 4 (int32).`);let n=e.byteLength/4,r=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case`int64`:{let e=BigInt64Array.from(r,BigInt);return new Uint8Array(e.buffer)}case`uint64`:{if(r.some(e=>e<0))throw Error(`Can not convert int32 data to uin64 - negative value found.`);let e=BigUint64Array.from(r,BigInt);return new Uint8Array(e.buffer)}case`int8`:{if(r.some(e=>e<-128||e>127))throw Error(`Can not convert int32 data to int8 - value out of range.`);let e=Int8Array.from(r,Number);return new Uint8Array(e.buffer)}case`uint8`:if(r.some(e=>e<0||e>255))throw Error(`Can not convert int32 data to uint8 - value out of range.`);return Uint8Array.from(r,Number);case`uint32`:{if(r.some(e=>e<0))throw Error(`Can not convert int32 data to uint32 - negative value found.`);let e=Uint32Array.from(r,Number);return new Uint8Array(e.buffer)}default:throw Error(`Unsupported data conversion from 'int32' to ${t}`)}},Yt=1,Xt=()=>Yt++,Zt=new Map([[`int8`,`int32`],[`uint8`,`int32`],[`uint32`,`int32`],[`int64`,`int32`]]),Qt=(e,t)=>{let n=Kt.get(e);if(!n)throw Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((e,t)=>e*t)*n/8):0},$t=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:r,dataType:i,shape:a,fallbackDataType:o}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=r,this.dataType=i,this.tensorShape=a,this.fallbackDataType=o}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Qt(this.dataType,this.tensorShape)}destroy(){L(`verbose`,()=>`[WebNN] TensorWrapper.destroy`),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=Jt(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}else return n.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((e,t)=>e===n[t])}setIsDataConverted(e){this.isDataConverted=e}},en=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,r){let i=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),o;if(!a?.input.dataTypes.includes(t)){if(o=Zt.get(t),!o||a?.input.dataTypes.includes(o))throw Error(`WebNN backend does not support data type: ${t}`);L(`verbose`,()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${o}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(i,t,n))return this.wrapper.tensor;if(r){if(this.wrapper.byteLength!==Qt(t,n))throw Error(`Unable to copy data to tensor with different size.`);this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>`u`?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,s,!0,!0,o),r&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType===`int32`)t=qt(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else L(`verbose`,()=>`Data size does not match tensor size. Releasing tensor.`),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Jt(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw Error(`Tensor has not been created.`);return e?this.wrapper.read(e):this.wrapper.read()}},tn=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw Error(`MLContext not found for session.`);return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Xt();return this.tensorTrackersById.set(e,new en(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,r,i){L(`verbose`,()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${r}, copyOld: ${i}}`);let a=this.tensorTrackersById.get(t);if(!a)throw Error(`Tensor not found.`);return a.ensureTensor(e,n,r,i)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw Error(`Tensor not found.`);n.upload(t)}async download(e,t){L(`verbose`,()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw Error(`Tensor not found.`);return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,r){let i=this.getMLContext(e),a=Xt(),o=new $t({sessionId:e,context:i,tensor:t,dataType:n,shape:r});return this.tensorTrackersById.set(a,new en(this,o)),this.externalTensors.add(o),a}async getCachedTensor(e,t,n,r,i,a,o){let s=this.getMLContext(e);for(let[r,i]of this.freeTensors.entries())if(i.canReuseTensor(s,t,n)){L(`verbose`,()=>`[WebNN] Reusing tensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:``} shape: ${n}`);let i=this.freeTensors.splice(r,1)[0];return i.sessionId=e,i}L(`verbose`,()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:``} shape: ${n}}`);let c=await s.createTensor({dataType:o??t,shape:n,dimensions:n,usage:r,writable:i,readable:a});return new $t({sessionId:e,context:s,tensor:c,dataType:t,shape:n,fallbackDataType:o})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},nn=(...e)=>new tn(...e)}),an,on,sn,cn=o(()=>{I(),P(),Gt(),rn(),Lt(),an=new Map([[1,`float32`],[10,`float16`],[6,`int32`],[12,`uint32`],[7,`int64`],[13,`uint64`],[22,`int4`],[21,`uint4`],[3,`int8`],[2,`uint8`],[9,`uint8`]]),on=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),r=Object.keys(t).sort();return n.length===r.length&&n.every((n,i)=>n===r[i]&&e[n]===t[n])},sn=class{constructor(e){this.tensorManager=nn(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Ft(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw Error(`No active session`);return this.activeSessionId}onRunStart(e){L(`verbose`,()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){L(`verbose`,()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let e of t)L(`verbose`,()=>`[WebNN] releasing temporary tensor {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let t=this.mlContextCache.findIndex(t=>t.gpuDevice===e);if(t!==-1)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:t}),t}}else if(e===void 0){let e=this.mlContextCache.findIndex(e=>e.options===void 0&&e.gpuDevice===void 0);if(e!==-1)return this.mlContextCache[e].mlContext;{let e=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:e}),e}}let t=this.mlContextCache.findIndex(t=>on(t.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:t}),t}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let e=this.mlContextCache.findIndex(e=>e.mlContext===t);e!==-1&&this.mlContextCache.splice(e,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){L(`verbose`,()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,r,i){let a=an.get(n);if(!a)throw Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,r,i)}async createTemporaryTensor(e,t,n){L(`verbose`,()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let r=an.get(t);if(!r)throw Error(`Unsupported ONNX data type: ${t}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,i,r,n,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(i):this.temporarySessionTensorIds.set(e,[i]),i}uploadTensor(e,t){if(!N().shouldTransferToMLTensor)throw Error(`Trying to upload to a MLTensor while shouldTransferToMLTensor is false`);L(`verbose`,()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return Wt(n,t)}}registerMLTensor(e,t,n,r){let i=an.get(n);if(!i)throw Error(`Unsupported ONNX data type: ${n}`);let a=this.tensorManager.registerTensor(e,t,i,r);return L(`verbose`,()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${i}, dimensions: ${r}} -> {tensorId: ${a}}`),a}registerMLConstant(e,t,n,r,i,a,o=!1){if(!a)throw Error(`External mounted files are not available.`);let s=e;e.startsWith(`./`)&&(s=e.substring(2));let c=a.get(s);if(!c)throw Error(`File with name ${s} not found in preloaded files.`);if(t+n>c.byteLength)throw Error(`Out of bounds: data offset and length exceed the external file data size.`);let l=c.slice(t,t+n).buffer,u;switch(i.dataType){case`float32`:u=new Float32Array(l);break;case`float16`:u=typeof Float16Array<`u`&&Float16Array.from?new Float16Array(l):new Uint16Array(l);break;case`int32`:u=new Int32Array(l);break;case`uint32`:u=new Uint32Array(l);break;case`int64`:if(o){let e=qt(new Uint8Array(l),`int64`);u=new Int32Array(e.buffer),i.dataType=`int32`}else u=new BigInt64Array(l);break;case`uint64`:u=new BigUint64Array(l);break;case`int8`:u=new Int8Array(l);break;case`int4`:case`uint4`:case`uint8`:u=new Uint8Array(l);break;default:throw Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return L(`verbose`,()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}} ${o?`(Note: it was int64 data type and registered to int32 as workaround)`:``}`),r.constant(i,u)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let r=an.get(xt(t)),i=this.mlOpSupportLimitsBySessionId.get(e);return typeof r>`u`?!1:n?!!i?.input.dataTypes.includes(r):!!i?.output.dataTypes.includes(r)}flush(){}}}),ln=o(()=>{}),un,dn,fn,pn,mn,hn,gn,_n,vn,yn=o(()=>{Lt(),ln(),un=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),dn=[],fn=e=>Math.ceil(Number(e)/16)*16,pn=e=>{for(let t=0;t<dn.length;t++){let n=dn[t];if(e<=n)return n}return Math.ceil(e/16)*16},mn=1,hn=()=>mn++,gn=async(e,t,n,r)=>{let i=fn(n),a=e.device.createBuffer({size:i,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let o=e.getCommandEncoder();e.endComputePass(),o.copyBufferToBuffer(t,0,a,0,i),e.flush(),await a.mapAsync(GPUMapMode.READ);let s=a.getMappedRange();if(r){let e=r();return e.set(new Uint8Array(s,0,n)),e}else return new Uint8Array(s.slice(0,n))}finally{a.destroy()}},_n=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[e]of un)dn.push(e),this.freeBuffers.set(e,[]),this.freeUniformBuffers.set(e,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,r=t.byteOffset,i=t.byteLength,a=fn(i),o=this.storageCache.get(e);if(!o)throw Error(`gpu data for uploading does not exist`);if(Number(o.originalSize)!==i)throw Error(`inconsistent data size. gpu data size=${o.originalSize}, data size=${i}`);let s=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),c=s.getMappedRange();new Uint8Array(c).set(new Uint8Array(n,r,i)),s.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(s,0,o.gpuData.buffer,0,a),this.backend.device.queue.submit([l.finish()]),s.destroy(),L(`verbose`,()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw Error(`source gpu data for memcpy does not exist`);let r=this.storageCache.get(t);if(!r)throw Error(`destination gpu data for memcpy does not exist`);if(n.originalSize!==r.originalSize)throw Error(`inconsistent source and destination gpu data size`);let i=fn(n.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(n.gpuData.buffer,0,r.gpuData.buffer,0,i)}registerExternalBuffer(e,t,n){let r;if(n){if(r=n[0],e===n[1])return L(`verbose`,()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, buffer is the same, skip.`),r;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else r=hn();return this.storageCache.set(r,{gpuData:{id:r,type:0,buffer:e},originalSize:t}),L(`verbose`,()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, registered.`),r}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),L(`verbose`,()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=pn(e),r,i=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||a){let e=(i?this.freeBuffers:this.freeUniformBuffers).get(n);r=e&&e.length>0?e.pop():this.backend.device.createBuffer({size:n,usage:t})}else r=this.backend.device.createBuffer({size:n,usage:t});let o={id:hn(),type:0,buffer:r};return this.storageCache.set(o.id,{gpuData:o,originalSize:Number(e)}),L(`verbose`,()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${o.id}`),o}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e==`bigint`?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw Error(`releasing data does not exist`)}return L(`verbose`,()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw Error(`data does not exist`);await gn(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus===`default`){for(let e of this.buffersPending){let t=un.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(e=>{e.destroy()}),this.capturedPendingBuffers.delete(e)),--this.sessionCount,this.sessionCount===0&&(L(`warning`,()=>`[WebGPU] Clearing webgpu buffer cache`),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.storageCache=new Map)}},vn=(...e)=>new _n(...e)}),bn,B,V=o(()=>{bn=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(`;`),this.key}},B=e=>new bn(e)}),xn,Sn,Cn,wn,H,U,Tn,En,Dn,W,On,G,K,kn,An,jn,Mn,q=o(()=>{I(),z(),xn=64,Sn=(e,t)=>{if(t===3)throw Error(`vec3 has same alignment as vec4, use vec4 instead`);switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:`f16`;case 1:return t>1?`vec${t}<f32>`:`f32`;case 6:return t>1?`vec${t}<i32>`:`i32`;case 12:return t>1?`vec${t}<u32>`:`u32`;case 7:if(t>1)throw Error(`currently not supported vecX of uint64 yet`);return[`vec2<u32>`,`i32`];case 13:if(t>1)throw Error(`currently not supported vecX of uint64 yet`);return[`vec2<u32>`,`u32`];case 9:if(t!==4)throw Error(`bool must be vec4`);return[`u32`,`vec4<bool>`];case 22:return`i32`;case 21:return`u32`;default:throw Error(`Unknown data type: ${e}`)}},Cn=(e,t=1)=>{let n=Sn(e,t);return typeof n==`string`?n:n[0]},wn=(e,t=1)=>{let n=Sn(e,t);return typeof n==`string`?n:n[1]},H=(...e)=>{let t=[];return e.forEach(e=>{e.length!==0&&t.push({type:12,data:e},{type:12,data:R.computeStrides(e)})}),t},U=e=>e%4==0?4:e%2==0?2:1,Tn=(e=`f32`,t,n=`0`)=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,En=(e,t,n)=>e===`f32`?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,Dn=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,W=(e,t,n,r)=>e.startsWith(`uniforms.`)&&n>4?typeof t==`string`?r===`f16`?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:r===`f16`?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,On=(e,t,n,r,i)=>{let a=typeof n==`number`,o=a?n:n.length,s=[...Array(o).keys()],c=o<2?`u32`:o<=4?`vec${o}<u32>`:`array<u32, ${o}>`,l=Sn(t,i),u=typeof l==`string`?l:l[1],d={indices:c,value:u,storage:typeof l==`string`?l:l[0],tensor:t},f=e=>typeof e==`string`?e:`${e}u`,p={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},m=a?`uniforms.`:``,h=`${m}${e}_shape`,g=`${m}${e}_strides`,_=``;for(let e=0;e<o-1;e++)_+=`
    let dim${e} = current / ${W(g,e,o)};
    let rest${e} = current % ${W(g,e,o)};
    indices[${e}] = dim${e};
    current = rest${e};
    `;_+=`indices[${o-1}] = current;`;let v=o<2?``:`
  fn o2i_${e}(offset: u32) -> ${d.indices} {
    var indices: ${d.indices};
    var current = offset;
    ${_}
    return indices;
  }`,y=t=>(p.offsetToIndices=!0,o<2?t:`o2i_${e}(${t})`),b=[];if(o>=2)for(let e=o-1;e>=0;e--)b.push(`${W(g,e,o)} * (indices[${e}])`);let x=o<2?``:`
  fn i2o_${e}(indices: ${d.indices}) -> u32 {
    return ${b.join(`+`)};
  }`,S=t=>(p.indicesToOffset=!0,o<2?t:`i2o_${e}(${t})`),C=(...e)=>o===0?`0u`:`${d.indices}(${e.map(f).join(`,`)})`,w=(e,t)=>o<2?`${e}`:`${W(e,t,o)}`,ee=(e,t,n)=>o<2?`${e}=${n};`:`${W(e,t,o)}=${n};`,T={},E=(t,n)=>{p.broadcastedIndicesToOffset=!0;let r=`${n.name}broadcastedIndicesTo${e}Offset`;if(r in T)return`${r}(${t})`;let i=[];for(let e=o-1;e>=0;e--){let t=n.indicesGet(`outputIndices`,e+n.rank-o);i.push(`${w(g,e)} * (${t} % ${w(h,e)})`)}return T[r]=`fn ${r}(outputIndices: ${n.type.indices}) -> u32 {
             return ${i.length>0?i.join(`+`):`0u`};
           }`,`${r}(${t})`},te=(t,n)=>(()=>{if(d.storage===d.value)return`${e}[${t}]=${n};`;if(d.storage===`vec2<u32>`&&d.value===`i32`)return`${e}[${t}]=vec2<u32>(u32(${n}), select(0u, 0xFFFFFFFFu, ${n} < 0));`;if(d.storage===`vec2<u32>`&&d.value===`u32`)return`${e}[${t}]=vec2<u32>(u32(${n}), 0u);`;if(d.storage===`u32`&&d.value===`vec4<bool>`)return`${e}[${t}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${n}));`;throw Error(`not supported combination of storage type ${d.storage} and value type ${d.value} yet`)})(),ne=t=>(()=>{if(d.storage===d.value)return`${e}[${t}]`;if(d.storage===`vec2<u32>`&&d.value===`i32`)return`i32(${e}[${t}].x)`;if(d.storage===`vec2<u32>`&&d.value===`u32`)return`u32(${e}[${t}].x)`;if(d.storage===`u32`&&d.value===`vec4<bool>`)return`vec4<bool>(bool(${e}[${t}] & 0xFFu), bool(${e}[${t}] & 0xFF00u), bool(${e}[${t}] & 0xFF0000u), bool(${e}[${t}] & 0xFF000000u))`;throw Error(`not supported combination of storage type ${d.storage} and value type ${d.value} yet`)})(),D=o<2?``:`
  fn get_${e}ByIndices(indices: ${d.indices}) -> ${u} {
    return ${ne(`i2o_${e}(indices)`)};
  }`,O=o<2?``:`
  fn get_${e}(${s.map(e=>`d${e}: u32`).join(`, `)}) -> ${u} {
    return get_${e}ByIndices(${C(s.map(e=>`d${e}`).join(`, `))});
  }`,re=(...t)=>{if(t.length!==o)throw Error(`indices length must be ${o}`);let n=t.map(f).join(`,`);return o===0?ne(`0u`):o===1?ne(n[0]):(p.get=!0,p.getByIndices=!0,p.indicesToOffset=!0,`get_${e}(${n})`)},ie=t=>o<2?ne(t):(p.getByIndices=!0,p.indicesToOffset=!0,`get_${e}ByIndices(${t})`),ae=o<2?``:`
  fn set_${e}ByIndices(indices: ${d.indices}, value: ${u}) {
    ${te(`i2o_${e}(indices)`,`value`)}
  }`,oe=o<2?``:`
  fn set_${e}(${s.map(e=>`d${e}: u32`).join(`, `)}, value: ${u}) {
    set_${e}ByIndices(${C(s.map(e=>`d${e}`).join(`, `))}, value);
  }`;return{impl:()=>{let e=[],t=!1;return p.offsetToIndices&&(e.push(v),t=!0),p.indicesToOffset&&(e.push(x),t=!0),p.broadcastedIndicesToOffset&&(Object.values(T).forEach(t=>e.push(t)),t=!0),p.set&&(e.push(oe),t=!0),p.setByIndices&&(e.push(ae),t=!0),p.get&&(e.push(O),t=!0),p.getByIndices&&(e.push(D),t=!0),!a&&t&&e.unshift(`const ${h} = ${d.indices}(${n.join(`,`)});`,`const ${g} = ${d.indices}(${R.computeStrides(n).join(`,`)});`),e.join(`
`)},type:d,offsetToIndices:y,indicesToOffset:S,broadcastedIndicesToOffset:E,indices:C,indicesGet:w,indicesSet:ee,set:(...t)=>{if(t.length!==o+1)throw Error(`indices length must be ${o}`);let n=t[o];if(typeof n!=`string`)throw Error(`value must be string`);let r=t.slice(0,o).map(f).join(`,`);return o===0?te(`0u`,n):o===1?te(r[0],n):(p.set=!0,p.setByIndices=!0,p.indicesToOffset=!0,`set_${e}(${r}, ${n})`)},setByOffset:te,setByIndices:(t,n)=>o<2?te(t,n):(p.setByIndices=!0,p.indicesToOffset=!0,`set_${e}ByIndices(${t}, ${n});`),get:re,getByOffset:ne,getByIndices:ie,usage:r,name:e,strides:g,shape:h,rank:o}},G=(e,t,n,r=1)=>On(e,t,n,`input`,r),K=(e,t,n,r=1)=>On(e,t,n,`output`,r),kn=(e,t,n)=>On(e,t,n,`atomicOutput`,1),An=(e,t,n,r=1)=>On(e,t,n,`internal`,r),jn=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e==`number`?`${e}u`:e}) { return; }`}mainStart(e=xn){let t=typeof e==`number`?e:e[0],n=typeof e==`number`?1:e[1],r=typeof e==`number`?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||r>this.limits.maxComputeWorkgroupSizeZ)throw Error(`workgroup size [${t}, ${n}, ${r}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*r>this.limits.maxComputeInvocationsPerWorkgroup)throw Error(`workgroup size [${t}, ${n}, ${r}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1;return`@compute @workgroup_size(${t}, ${n}, ${r})
  fn main(${i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`}) {
    ${i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*r}u + local_idx;`}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith(`uniforms.`)&&this.uniforms.push({name:e.shape.replace(`uniforms.`,``),type:`u32`,length:e.rank}),e.strides.startsWith(`uniforms.`)&&this.uniforms.push({name:e.strides.replace(`uniforms.`,``),type:`u32`,length:e.rank}))}declareVariable(e,t){if(e.usage===`internal`)throw Error(`cannot use internal variable with declareVariable(). use registerInternalVariables() instead.`);this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage===`input`?`read`:`read_write`,r=e.usage===`atomicOutput`?`atomic<i32>`:e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${r}>;`}declareVariables(...e){return e.map(e=>this.declareVariable(e,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!==`internal`)throw Error(`cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.`);this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(e=>this.registerInternalVariable(e)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return``;let e=[];for(let{name:t,type:n,length:r}of this.uniforms)if(r&&r>4)n===`f16`?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(r/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(r/4)}>`);else{let i=r==null||r===1?n:`vec${r}<${n}>`;e.push(`${t}:${i}`)}return`
      struct Uniforms { ${e.join(`, `)} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=e=>[12,10,1,6][[`u32`,`f16`,`f32`,`i32`].indexOf(e)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Mn=(e,t)=>new jn(e,t)}),Nn,Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn=o(()=>{I(),z(),V(),q(),Nn=(e,t)=>{if(!e||e.length!==1)throw Error(`Transpose requires 1 input.`);if(t.length!==0&&t.length!==e[0].dims.length)throw Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Pn=(e,t)=>t.length===0?[...Array(e).keys()].reverse():t,Fn=(e,t)=>R.sortBasedOnPerm(e,Pn(e.length,t)),In=(e,t,n,r)=>{let i=`fn perm(i: ${r.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let n=0;n<t;++n)i+=`a[${e[n]}]=i[${n}];`;return i+=`return a;}`},Ln=(e,t)=>{let n=[],r=[];for(let i=0;i<e.length;++i)e[i]!==1&&n.push(e[i]),e[t[i]]!==1&&r.push(t[i]);return{newShape:n,newPerm:r}},Rn=(e,t)=>{let n=0;for(let r=0;r<e.length;++r)if(t[e[r]]!==1){if(e[r]<n)return!1;n=e[r]}return!0},zn=(e,t)=>{let n=e.dataType,r=e.dims.length,i=Pn(r,t),a=Fn(e.dims,i),o=e.dims,s=a,c=r<2||Rn(i,e.dims),l;if(c)return l=e=>{let t=G(`input`,n,o,4),r=K(`output`,n,s,4);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    output[global_idx] = input[global_idx];
  }`},{name:`TransposeCopy`,shaderCache:{inputDependencies:[`type`]},getRunData:()=>{let t=R.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64/4)},programUniforms:[{type:12,data:Math.ceil(t/4)}]}},getShaderSource:l};let{newShape:u,newPerm:d}=Ln(e.dims,i),f=R.areEqual(d,[2,3,1]),p=R.areEqual(d,[3,1,2]);return u.length===2||f||p?(o=f?[u[0],u[1]*u[2]]:p?[u[0]*u[1],u[2]]:u,s=[o[1],o[0]],l=e=>{let t=G(`a`,n,o.length),r=K(`output`,n,s.length);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,r)}
  var<workgroup> tile : array<array<${r.type.value}, 17>, 16>;
  ${e.mainStart([16,16,1])}
    let stride = (uniforms.output_shape[1] - 1) / 16 + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * 16u + local_id.x;
    let input_row = workgroup_id_x * 16u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${t.getByIndices(`${t.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * 16u + local_id.x;
    let output_row = workgroup_id_y * 16u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${r.setByIndices(`${r.type.indices}(output_row, output_col)`,`tile[local_id.x][local_id.y]`)}
    }
  }`},{name:`TransposeShared`,shaderCache:{inputDependencies:[`type`]},getRunData:()=>{let t=R.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(s[1]/16),y:Math.ceil(s[0]/16)},programUniforms:[{type:12,data:t},...H(o,s)]}},getShaderSource:l}):(l=e=>{let t=G(`a`,n,o.length),a=K(`output`,n,s.length);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,a)}

  ${In(i,r,t,a)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let indices = ${a.offsetToIndices(`global_idx`)};
    let aIndices = perm(indices);

    ${a.setByOffset(`global_idx`,t.getByIndices(`aIndices`))}
  }`},{name:`Transpose`,shaderCache:{hint:`${t}`,inputDependencies:[`rank`]},getRunData:()=>{let t=R.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:[{type:12,data:t},...H(o,s)]}},getShaderSource:l})},Bn=(e,t)=>{Nn(e.inputs,t.perm),e.compute(zn(e.inputs[0],t.perm))},Vn=e=>B({perm:e.perm})}),Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur=o(()=>{I(),z(),q(),Pr(),Hn(),Un={max:`select(bestValue, candidate, candidate > bestValue)`,min:`select(bestValue, candidate, candidate < bestValue)`,mean:`bestValue + candidate`,sum:`bestValue + candidate`,prod:`bestValue * candidate`,sumSquare:`bestValue + candidate * candidate`,logSumExp:`bestValue + exp(candidate)`,l1:`bestValue + abs(candidate)`,l2:`bestValue + candidate * candidate`,logSum:`bestValue + candidate`},Wn={max:`select(bestValue, candidate, candidate > bestValue)`,min:`select(bestValue, candidate, candidate < bestValue)`,mean:`bestValue + candidate`,sum:`bestValue + candidate`,prod:`bestValue * candidate`,sumSquare:`bestValue + candidate`,logSumExp:`bestValue + candidate`,l1:`bestValue + candidate`,l2:`bestValue + candidate`,logSum:`bestValue + candidate`},Gn={max:`_A[offset]`,min:`_A[offset]`,mean:`0`,sum:`0`,prod:`1`,sumSquare:`0`,logSumExp:`0`,l1:`0`,l2:`0`,logSum:`0`},Kn={max:`bestValue`,min:`bestValue`,sum:`bestValue`,prod:`bestValue`,sumSquare:`bestValue`,logSumExp:`log(bestValue)`,l1:`bestValue`,l2:`sqrt(bestValue)`,logSum:`log(bestValue)`},qn=(e,t)=>{let n=[];for(let r=t-e;r<t;++r)n.push(r);return n},Jn=(e,t)=>{let n=[],r=e.length;for(let i=0;i<r;i++)t.indexOf(i)===-1&&n.push(e[i]);return[n,t.map(t=>e[t])]},Yn=(e,t)=>{let n=e.length+t.length,r=[],i=0;for(let a=0;a<n;a++)t.indexOf(a)===-1?r.push(e[i++]):r.push(1);return r},Xn=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},Zn=(e,t)=>{let n=[];if(!Xn(e,t)){for(let r=0;r<t;++r)e.indexOf(r)===-1&&n.push(r);e.forEach(e=>n.push(e))}return n},Qn=(e,t,n,r,i,a,o)=>{let s=n[0].dims,c=R.size(a),l=R.size(o),u=G(`_A`,n[0].dataType,s),d=K(`output`,i,a),f=64;c===1&&(f=256);let p=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:[`type`]},getShaderSource:e=>`
        ${e.registerUniform(`reduceSize`,`u32`).declareVariables(u,d)}
        ${p}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${e.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Gn[r]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${u.getByOffset(`offset + k`)});
           bestValue = ${Un[r]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Wn[r]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${d.setByOffset(`outputIndex`,`${r===`mean`?`${d.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${d.type.storage}(${Kn[r]})`}`)};
         }
        }`,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:c},programUniforms:[{type:12,data:l}]})}},$n=(e,t,n,r)=>{let i=e.inputs.length===1?n:mr(e.inputs,n),a=i.axes;a.length===0&&!i.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((e,t)=>t));let o=R.normalizeAxes(a,e.inputs[0].dims.length),s=o,c=e.inputs[0],l=Zn(s,e.inputs[0].dims.length);l.length>0&&(c=e.compute(zn(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],s=qn(s.length,c.dims.length));let[u,d]=Jn(c.dims,s),f=u;i.keepDims&&(f=Yn(u,o)),e.compute(Qn(t,i.cacheKey,[c],r,e.inputs[0].dataType,f,d),{inputs:[c]})},er=(e,t)=>{$n(e,`ReduceMeanShared`,t,`mean`)},tr=(e,t)=>{$n(e,`ReduceL1Shared`,t,`l1`)},nr=(e,t)=>{$n(e,`ReduceL2Shared`,t,`l2`)},rr=(e,t)=>{$n(e,`ReduceLogSumExpShared`,t,`logSumExp`)},ir=(e,t)=>{$n(e,`ReduceMaxShared`,t,`max`)},ar=(e,t)=>{$n(e,`ReduceMinShared`,t,`min`)},or=(e,t)=>{$n(e,`ReduceProdShared`,t,`prod`)},sr=(e,t)=>{$n(e,`ReduceSumShared`,t,`sum`)},cr=(e,t)=>{$n(e,`ReduceSumSquareShared`,t,`sumSquare`)},lr=(e,t)=>{$n(e,`ReduceLogSumShared`,t,`logSum`)}}),dr,fr,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,J,Cr,wr,Y,Tr,X,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr=o(()=>{I(),z(),V(),q(),ur(),dr=e=>{if(!e||e.length===0||e.length>2)throw Error(`Reduce op requires 1 or 2 inputs.`);if(e.length===2&&e[1].dims.length!==1)throw Error(`Invalid axes input dims.`)},fr=e=>[``,``,`var value = ${e.getByIndices(`input_indices`)};`,``],pr=(e,t,n,r,i,a,o=!1,s=!1)=>{let c=[],l=n[0].dims,u=l.length,d=R.normalizeAxes(i,u),f=!s&&d.length===0;l.forEach((e,t)=>{f||d.indexOf(t)>=0?o&&c.push(1):c.push(e)});let p=c.length,m=R.size(c);return{name:e,shaderCache:t,getShaderSource:e=>{let t=[],i=G(`_A`,n[0].dataType,u),s=K(`output`,a,p),c=r(i,s,d),m=c[2];for(let e=0,n=0;e<u;e++)f||d.indexOf(e)>=0?(o&&n++,m=`for(var j${e}: u32 = 0; j${e} < ${l[e]}; j${e}++) {
                  ${c[2].includes(`last_index`)?`let last_index = j${e};`:``}
                  ${i.indicesSet(`input_indices`,e,`j${e}`)}
                  ${m}
                }`):(t.push(`${i.indicesSet(`input_indices`,e,s.indicesGet(`output_indices`,n))};`),n++);return`

        ${e.registerUniform(`output_size`,`u32`).declareVariables(i,s)}

        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          var input_indices: ${i.type.indices};
          let output_indices = ${s.offsetToIndices(`global_idx`)};

          ${t.join(`
`)}
          ${c[0]}       // init ops for reduce max/min
          ${c[1]}
          ${m}
          ${c[3]}
          ${c.length===4?s.setByOffset(`global_idx`,`value`):c.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:c,dataType:a}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...H(l,c)]})}},mr=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(e=>n.push(Number(e))),B({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},hr=(e,t,n,r)=>{let i=e.inputs,a=i.length===1?n:mr(i,n);e.compute(pr(t,{hint:a.cacheKey,inputDependencies:[`rank`]},[i[0]],a.noopWithEmptyAxes&&a.axes.length===0?fr:r,a.axes,i[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},gr=(e,t)=>{dr(e.inputs),hr(e,`ReduceLogSum`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += ${e.getByIndices(`input_indices`)};`,`value = log(value);`])},_r=(e,t)=>{dr(e.inputs),hr(e,`ReduceL1`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += abs(${e.getByIndices(`input_indices`)});`,``])},vr=(e,t)=>{dr(e.inputs),hr(e,`ReduceL2`,t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,``,`t = ${e.getByIndices(`input_indices`)}; value += (t * t);`,`value = sqrt(value);`])},yr=(e,t)=>{dr(e.inputs),hr(e,`ReduceLogSumExp`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += exp(${e.getByIndices(`input_indices`)});`,`value = log(value);`])},br=(e,t)=>{dr(e.inputs),hr(e,`ReduceMax`,t,(e,t,n)=>{let r=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||n.length===0)&&r.push(e.indicesSet(`input_indices`,t,0));return[`${r.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};`,`value = max(value, ${e.getByIndices(`input_indices`)});`,``]})},xr=(e,t)=>{dr(e.inputs),hr(e,`ReduceMean`,t,(t,n,r)=>{let i=1;for(let n=0;n<t.rank;n++)(r.indexOf(n)>=0||r.length===0)&&(i*=e.inputs[0].dims[n]);return[`var sum = f32(0);`,``,`sum += f32(${t.getByIndices(`input_indices`)});`,`let value = ${n.type.value}(sum / ${i});`]})},Sr=(e,t)=>{dr(e.inputs),hr(e,`ReduceMin`,t,(e,t,n)=>{let r=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||n.length===0)&&r.push(`input_indices[${t}] = 0;`);return[`${r.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};`,`value = min(value, ${e.getByIndices(`input_indices`)});`,``]})},J=(e,t)=>{dr(e.inputs),hr(e,`ReduceProd`,t,(e,t)=>[`var value = ${t.type.storage}(1);`,``,`value *= ${e.getByIndices(`input_indices`)};`,``])},Cr=(e,t)=>{dr(e.inputs),hr(e,`ReduceSum`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += ${e.getByIndices(`input_indices`)};`,``])},wr=(e,t)=>{dr(e.inputs),hr(e,`ReduceSumSquare`,t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,``,`t = ${e.getByIndices(`input_indices`)}; value += t * t;`,``])},Y=(e,t,n)=>{if(t.length===0)return n;let r=1,i=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?r*=e[n]:i*=e[n];return i<32&&r>1024},Tr=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?xr(e,t):er(e,t)},X=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_r(e,t):tr(e,t)},Er=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vr(e,t):nr(e,t)},Dr=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yr(e,t):rr(e,t)},Or=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?br(e,t):ir(e,t)},kr=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Sr(e,t):ar(e,t)},Ar=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?J(e,t):or(e,t)},jr=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Cr(e,t):sr(e,t)},Mr=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wr(e,t):cr(e,t)},Nr=(e,t)=>{Y(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?gr(e,t):lr(e,t)}}),Fr,Ir,Lr,Rr,zr=o(()=>{I(),V(),Pr(),Fr=e=>{if(!e||e.length===0||e.length>2)throw Error(`ArgMinMaxOp op requires 1 or 2 inputs.`);if(e[0].dataType!==1)throw Error(`Invalid input type.`)},Ir=(e,t)=>{Fr(e.inputs),e.compute(pr(`ArgMin`,{hint:t.cacheKey,inputDependencies:[`rank`]},[e.inputs[0]],(e,n,r)=>{let i=[];for(let t=0;t<e.rank;t++)(r.indexOf(t)>=0||r.length===0)&&i.push(`input_indices[${t}] = 0;`);return[`${i.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};
var best_index : i32 = 0;`,`if (${e.getByIndices(`input_indices`)} ${t.selectLastIndex>0?`<=`:`<`} value) {
         value = ${e.getByIndices(`input_indices`)};
         best_index = i32(last_index);
       }`,``,n.setByOffset(`global_idx`,`best_index`)]},[t.axis],7,t.keepDims),{inputs:[0]})},Lr=(e,t)=>{Fr(e.inputs),e.compute(pr(`argMax`,{hint:t.cacheKey,inputDependencies:[`rank`]},[e.inputs[0]],(e,n,r)=>{let i=[];for(let t=0;t<e.rank;t++)(r.indexOf(t)>=0||r.length===0)&&i.push(`input_indices[${t}] = 0;`);return[`${i.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};
var best_index : i32 = 0;`,`if (${e.getByIndices(`input_indices`)} ${t.selectLastIndex>0?`>=`:`>`} value) {
         value = ${e.getByIndices(`input_indices`)};
         best_index = i32(last_index);
       }`,``,n.setByOffset(`global_idx`,`best_index`)]},[t.axis],7,t.keepDims),{inputs:[0]})},Rr=e=>B(e)}),Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr=o(()=>{I(),z(),ln(),q(),Br=(e,t)=>{let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5];if(o&&s)throw Error(`Attention cannot have both past and attention_bias`);if(n.dims.length!==3)throw Error(`Input "input" must have 3 dimensions`);let c=n.dims[0],l=n.dims[1],u=n.dims[2];if(i.dims.length!==1)throw Error(`Input "bias" is expected to have 1 dimensions`);if(r.dims.length!==2)throw Error(`Input "weights" is expected to have 2 dimensions`);if(r.dims[0]!==u)throw Error(`Input 1 dimension 0 should have same length as dimension 2 of input 0`);if(i.dims[0]!==r.dims[1])throw Error(`Input "bias" dimension 0 should have same length as dimension 1 of input "weights"`);let d=i.dims[0]/3,f=d,p=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw Error(`qkv_hidden_sizes attribute should have 3 elements`);for(let e of t.qkvHiddenSizes)if(e%t.numHeads!==0)throw Error(`qkv_hidden_sizes should be divisible by num_heads`);d=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],p=t.qkvHiddenSizes[2]}let m=l;if(d!==f)throw Error(`qkv_hidden_sizes first element should be same as the second`);if(i.dims[0]!==d+f+p)throw Error(`Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes`);let h=0;if(o){if(f!==p)throw Error(`Input "past" expect k_hidden_size == v_hidden_size`);if(o.dims.length!==5)throw Error(`Input "past" must have 5 dimensions`);if(o.dims[0]!==2)throw Error(`Input "past" first dimension must be 2`);if(o.dims[1]!==c)throw Error(`Input "past" second dimension must be batch_size`);if(o.dims[2]!==t.numHeads)throw Error(`Input "past" third dimension must be num_heads`);if(o.dims[4]!==f/t.numHeads)throw Error(`Input "past" fifth dimension must be k_hidden_size / num_heads`);t.pastPresentShareBuffer||(h=o.dims[3])}let g=m+h;if(a)throw Error(`Mask not supported`);if(o)throw Error(`past is not supported`);if(s){if(s.dims.length!==4)throw Error(`Input "attention_bias" must have 4 dimensions`);if(s.dims[0]!==c||s.dims[1]!==t.numHeads||s.dims[2]!==l||s.dims[3]!==g)throw Error(`Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)`)}return{batchSize:c,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:m,totalSequenceLength:g,maxSequenceLength:-1,inputHiddenSize:u,hiddenSize:d,vHiddenSize:p,headSize:Math.floor(d/t.numHeads),vHeadSize:Math.floor(p/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:0,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Vr=(e,t,n)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset(`0`)});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset(`batchIdx`)}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?`let past_sequence_length = uniforms.past_sequence_length`:``};
    let present_sequence_length = total_sequence_length;
    `,Hr=(e,t,n,r,i,a,o,s)=>{let c=U(o?1:a),l=64,u=a/c;u<l&&(l=32);let d=Math.ceil(a/c/l),f=[{type:12,data:t},{type:12,data:n},{type:12,data:r},{type:12,data:i},{type:12,data:u},{type:12,data:d}],p=Cn(e.dataType,c),m=wn(1,c),h=[`type`];return o&&h.push(`type`),s&&h.push(`type`),{name:`AttentionProbsSoftmax`,shaderCache:{hint:`${l};${p};${c}`,inputDependencies:h},getShaderSource:t=>{let n=K(`x`,e.dataType,e.dims,c),r=[n],i=o?G(`seq_lens`,o.dataType,o.dims):void 0;i&&r.push(i);let a=s?G(`total_sequence_length_input`,s.dataType,s.dims):void 0;a&&r.push(a);let u=wn(e.dataType);return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${t.registerUniforms([{name:`batch_size`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`past_sequence_length`,type:`u32`},{name:`sequence_length`,type:`u32`},{name:`total_sequence_length`,type:`u32`},{name:`elements_per_thread`,type:`u32`}]).declareVariables(...r)}
  ${t.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Vr(i,a,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${o?`u32(past_sequence_length + workgroup_id.y + 1)`:`total_sequence_length`};
    var thread_max_vector = ${m}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(c){case 1:return`thread_max_vector`;case 2:return`max(thread_max_vector.x, thread_max_vector.y)`;case 4:return`max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))`;default:throw Error(`Unsupported components: ${c}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(c){case 1:return`sum_vector`;case 2:return`sum_vector.x + sum_vector.y`;case 4:return`sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w`;default:throw Error(`Unsupported components: ${c}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${n.type.value}(${u}(1.0) / ${u}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${n.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${o?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${n.type.value}(${u}(0));
        }`:``};
  }`},getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:i,z:t*n},programUniforms:f})}},Ur=(e,t,n,r,i,a,o,s,c)=>{let l=o+a.kvSequenceLength,u=[a.batchSize,a.numHeads,a.sequenceLength,l],d=e>1&&r,f=a.kvNumHeads?a.kvNumHeads:a.numHeads,p=d?[a.batchSize,f,l,a.headSize]:void 0,m=a.nReps?a.nReps:1,h=a.scale===0?1/Math.sqrt(a.headSize):a.scale,g=U(a.headSize),_=a.headSize/g,v={x:Math.ceil(l/12),y:Math.ceil(a.sequenceLength/12),z:a.batchSize*a.numHeads},y=[{type:12,data:a.sequenceLength},{type:12,data:_},{type:12,data:l},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:h},{type:12,data:o},{type:12,data:a.kvSequenceLength},{type:12,data:m}],b=d&&r&&R.size(r.dims)>0,x=[`type`,`type`];b&&x.push(`type`),i&&x.push(`type`),s&&x.push(`type`),c&&x.push(`type`);let S=[{dims:u,dataType:t.dataType,gpuDataType:0}];return d&&S.push({dims:p,dataType:t.dataType,gpuDataType:0}),{name:`AttentionProbs`,shaderCache:{hint:`${g};${i!==void 0};${r!==void 0};${e}`,inputDependencies:x},getRunData:()=>({outputs:S,dispatchGroup:v,programUniforms:y}),getShaderSource:e=>{let a=G(`q`,t.dataType,t.dims,g),o=[a,G(`key`,n.dataType,n.dims,g)];if(b){let e=G(`past_key`,r.dataType,r.dims,g);o.push(e)}i&&o.push(G(`attention_bias`,i.dataType,i.dims));let l=s?G(`seq_lens`,s.dataType,s.dims):void 0;l&&o.push(l);let f=c?G(`total_sequence_length_input`,c.dataType,c.dims):void 0;f&&o.push(f);let h=K(`output`,t.dataType,u),_=[h];d&&_.push(K(`present_key`,t.dataType,p,g));let v=wn(1,g);return`
  const TILE_SIZE = 12u;

  var<workgroup> tileQ: array<${a.type.storage}, 144>;
  var<workgroup> tileK: array<${a.type.storage}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`alpha`,type:`f32`},{name:`past_sequence_length`,type:`u32`},{name:`kv_sequence_length`,type:`u32`},{name:`n_reps`,type:`u32`}]).declareVariables(...o,..._)}
  ${e.mainStart([12,12,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?`headIdx`:`headIdx / uniforms.n_reps`};
    let kv_num_heads = ${m===1?`uniforms.num_heads`:`uniforms.num_heads / uniforms.n_reps`};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Vr(l,f,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${b&&d?`let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;`:``};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${d?`let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;`:``}
    var value = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${b&&d?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${d?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:``}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${v}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(g){case 1:return`value`;case 2:return`value.x + value.y`;case 4:return`value.x + value.y + value.z + value.w`;default:throw Error(`Unsupported components: ${g}`)}})()};
        output[outputIdx] = ${h.type.value} (sum * uniforms.alpha) + ${i?`attention_bias[outputIdx]`:`0.0`};
    }
  }`}}},Wr=(e,t,n,r,i,a,o=void 0,s=void 0)=>{let c=a+i.kvSequenceLength,l=i.nReps?i.nReps:1,u=i.vHiddenSize*l,d=e>1&&r,f=i.kvNumHeads?i.kvNumHeads:i.numHeads,p=d?[i.batchSize,f,c,i.headSize]:void 0,m=[i.batchSize,i.sequenceLength,u],h={x:Math.ceil(i.vHeadSize/12),y:Math.ceil(i.sequenceLength/12),z:i.batchSize*i.numHeads},g=[{type:12,data:i.sequenceLength},{type:12,data:c},{type:12,data:i.vHeadSize},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:12,data:u},{type:12,data:a},{type:12,data:i.kvSequenceLength},{type:12,data:l}],_=d&&r&&R.size(r.dims)>0,v=[`type`,`type`];_&&v.push(`type`),o&&v.push(`type`),s&&v.push(`type`);let y=[{dims:m,dataType:t.dataType,gpuDataType:0}];return d&&y.push({dims:p,dataType:t.dataType,gpuDataType:0}),{name:`AttentionScore`,shaderCache:{hint:`${r!==void 0};${e}`,inputDependencies:v},getRunData:()=>({outputs:y,dispatchGroup:h,programUniforms:g}),getShaderSource:e=>{let i=G(`probs`,t.dataType,t.dims),a=[i,G(`v`,n.dataType,n.dims)];_&&a.push(G(`past_value`,r.dataType,r.dims));let c=o?G(`seq_lens`,o.dataType,o.dims):void 0;o&&a.push(c);let u=s?G(`total_sequence_length_input`,s.dataType,s.dims):void 0;s&&a.push(u);let f=[K(`output`,t.dataType,m)];return d&&f.push(K(`present_value`,t.dataType,p)),`
  const TILE_SIZE = 12u;
  var<workgroup> tileQ: array<${i.type.value}, 144>;
  var<workgroup> tileV: array<${i.type.value}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`v_hidden_size`,type:`u32`},{name:`past_sequence_length`,type:`u32`},{name:`kv_sequence_length`,type:`u32`},{name:`n_reps`,type:`u32`}]).declareVariables(...a,...f)}
  ${e.mainStart([12,12,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?`headIdx`:`headIdx / uniforms.n_reps`};
   let kv_num_heads = ${l===1?`uniforms.num_heads`:`uniforms.num_heads / uniforms.n_reps`};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Vr(c,u,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${_&&d?`let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;`:``};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${d?`let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;`:``}
   var value = ${i.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${_&&d?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${d?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:``}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`}}},Gr=(e,t,n,r,i,a,o,s,c,l,u=void 0,d=void 0)=>{let f=Math.min(e.outputCount,1+ +!!o+ +!!s),p=f>1?o:void 0,m=f>1?s:void 0,h=f>1?l.pastSequenceLength:0,g=h+l.kvSequenceLength,_=c&&R.size(c.dims)>0?c:void 0,v=[t,n];p&&R.size(p.dims)>0&&v.push(p),_&&v.push(_),u&&v.push(u),d&&v.push(d);let y=e.compute(Ur(f,t,n,p,_,l,h,u,d),{inputs:v,outputs:f>1?[-1,1]:[-1]})[0];e.compute(Hr(y,l.batchSize,l.numHeads,h,l.sequenceLength,g,u,d),{inputs:u&&d?[y,u,d]:[y],outputs:[]});let b=[y,r];m&&R.size(m.dims)>0&&b.push(m),u&&b.push(u),d&&b.push(d),e.compute(Wr(f,y,r,m,l,h,u,d),{inputs:b,outputs:f>1?[0,2]:[0]})},Kr=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],r=t.sequenceLength,i=t.inputHiddenSize,a=t.headSize,o={x:Math.ceil(t.headSize/12),y:Math.ceil(t.sequenceLength/12),z:t.batchSize*t.numHeads},s=[e.inputs[0],e.inputs[1],e.inputs[2]],c=[{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}];return e.compute({name:`AttentionPrepare`,shaderCache:{inputDependencies:[`type`,`type`,`type`]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:c}),getShaderSource:e=>{let t=K(`output_q`,s[0].dataType,n),r=K(`output_k`,s[0].dataType,n),i=K(`output_v`,s[0].dataType,n),a=G(`input`,s[0].dataType,s[0].dims),o=G(`weight`,s[1].dataType,s[1].dims),c=G(`bias`,s[2].dataType,s[2].dims),l=a.type.storage;return`
  const TILE_SIZE = 12u;
  var<workgroup> tileInput: array<${l}, 144>;
  var<workgroup> tileWeightQ: array<${l}, 144>;
  var<workgroup> tileWeightK: array<${l}, 144>;
  var<workgroup> tileWeightV: array<${l}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`hidden_size`,type:`u32`},{name:`ldb`,type:`u32`}]).declareVariables(a,o,c,t,r,i)}
  ${e.mainStart([12,12,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${l}(0);
    var valueK = ${l}(0);
    var valueV = ${l}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`}},{inputs:s,outputs:[-1,-1,-1]})},qr=(e,t)=>{let n=Br(e.inputs,t),[r,i,a]=Kr(e,n);return Gr(e,r,i,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),Yr,Xr,Zr,Qr,$r=o(()=>{je(),I(),z(),V(),q(),Yr=(e,t)=>{if(!e||e.length!==5)throw Error(`BatchNormalization requires 5 inputs`);let n=(e,t,n)=>{let r=t.length;if(r!==e.length)throw Error(`${n}: num dimensions != ${r}`);t.forEach((t,r)=>{if(t!==e[r])throw Error(`${n}: dim[${r}] do not match`)})};if(e[0].dims.length>1){let r=t.format===`NHWC`?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,r,`Invalid input scale`),n(e[2].dims,r,`Invalid input B`),n(e[3].dims,r,`Invalid input mean`),n(e[4].dims,r,`Invalid input var`)}else n(e[1].dims,[1],`Invalid input scale`),n(e[2].dims,[1],`Invalid input B`),n(e[3].dims,[1],`Invalid input mean`),n(e[4].dims,[1],`Invalid input var`)},Xr=(e,t)=>{let{epsilon:n,spatial:r,format:i}=t,a=e[0].dims,o=r?U(a[a.length-1]):1,s=i===`NHWC`&&a.length>1?o:1,c=R.size(a)/o,l=r,u=l?a.length:a,d=G(`x`,e[0].dataType,e[0].dims,o),f=G(`scale`,e[1].dataType,e[1].dims,s),p=G(`bias`,e[2].dataType,e[2].dims,s),m=G(`inputMean`,e[3].dataType,e[3].dims,s),h=G(`inputVar`,e[4].dataType,e[4].dims,s),g=K(`y`,e[0].dataType,u,o),_=()=>{let e=``;if(r)e=`let cOffset = ${a.length===1?`0u`:i===`NHWC`?`outputIndices[${a.length-1}] / ${o}`:`outputIndices[1]`};`;else if(i===`NCHW`)e=`
            ${g.indicesSet(`outputIndices`,`0`,`0`)}
            let cOffset = ${g.indicesToOffset(`outputIndices`)};`;else{e=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let t=1;t<f.rank;t++)e+=`cIndices[${t}] = outputIndices[${t}];`;e+=`let cOffset = ${f.indicesToOffset(`cIndices`)};`}return e};return{name:`BatchNormalization`,shaderCache:{hint:`${t.epsilon}_${t.format}_${r}_${o}`,inputDependencies:l?[`rank`,`type`,`type`,`type`,`type`]:void 0},getShaderSource:e=>`
  const epsilon = ${n};
  ${e.registerUniform(`outputSize`,`u32`).declareVariables(d,f,p,m,h,g)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
    var outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
    ${_()}
    let scale = ${f.getByOffset(`cOffset`)};
    let bias = ${p.getByOffset(`cOffset`)};
    let inputMean = ${m.getByOffset(`cOffset`)};
    let inputVar = ${h.getByOffset(`cOffset`)};
    let x = ${d.getByOffset(`global_idx`)};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${g.setByOffset(`global_idx`,`value`)}
  }`,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l?[{type:12,data:c},...H(a)]:[{type:12,data:c}]})}},Zr=e=>B(e),Qr=(e,t)=>{let{inputs:n,outputCount:r}=e,i=Zr({...t,outputCount:r});if(S.webgpu.validateInputContent&&Yr(n,i),t.trainingMode)throw Error(`BatchNormalization trainingMode is not supported yet.`);e.compute(Xr(n,i))}}),ei,ti,ni,ri=o(()=>{z(),q(),ei=e=>{if(e[0].dims.length!==3)throw Error(`input should have 3 dimensions`);if(![320,640,1280].includes(e[0].dims[2]))throw Error(`number of channels should be 320, 640 or 1280`);if(e[1].dims.length!==1)throw Error(`bias is expected to have 1 dimensions`);if(e[0].dims[2]!==e[1].dims[0])throw Error(`last dimension of input and bias are not the same`)},ti=e=>{let t=e[0].dims,n=e[0].dims[2],r=R.size(t)/4,i=e[0].dataType,a=G(`input`,i,t,4),o=G(`bias`,i,[n],4),s=G(`residual`,i,t,4),c=K(`output`,i,t,4);return{name:`BiasAdd`,getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)}}),getShaderSource:e=>`
  const channels = ${n}u / 4;
  ${e.declareVariables(a,o,s,c)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(r)}
    let value = ${a.getByOffset(`global_idx`)}
      + ${o.getByOffset(`global_idx % channels`)} + ${s.getByOffset(`global_idx`)};
    ${c.setByOffset(`global_idx`,`value`)}
  }`}},ni=e=>{ei(e.inputs),e.compute(ti(e.inputs))}}),ii,Z,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji=o(()=>{I(),z(),V(),q(),ii=(e,t,n,r,i,a,o)=>{let s=Math.ceil(t/4),c=``;c=typeof i==`string`?`${i}(a)`:i(`a`);let l=G(`inputData`,n,[s],4),u=K(`outputData`,r,[s],4),d=[{name:`vec_size`,type:`u32`}];return o&&d.push(...o),`
      ${e.registerUniforms(d).declareVariables(l,u)}

  ${a??``}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}

    let a = ${l.getByOffset(`global_idx`)};
    ${u.setByOffset(`global_idx`,c)}
  }`},Z=(e,t,n,r,i,a=e.dataType,o,s)=>{let c=[{type:12,data:Math.ceil(R.size(e.dims)/4)}];return o&&c.push(...o),{name:t,shaderCache:{hint:i,inputDependencies:[`type`]},getShaderSource:t=>ii(t,R.size(e.dims),e.dataType,a,n,r,s),getRunData:t=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(R.size(t[0].dims)/64/4)},programUniforms:c})}},ai=e=>{e.compute(Z(e.inputs[0],`Abs`,`abs`))},oi=e=>{e.compute(Z(e.inputs[0],`Acos`,`acos`))},si=e=>{e.compute(Z(e.inputs[0],`Acosh`,`acosh`))},ci=e=>{e.compute(Z(e.inputs[0],`Asin`,`asin`))},li=e=>{e.compute(Z(e.inputs[0],`Asinh`,`asinh`))},ui=e=>{e.compute(Z(e.inputs[0],`Atan`,`atan`))},di=e=>{e.compute(Z(e.inputs[0],`Atanh`,`atanh`))},fi=e=>B(e),pi=(e,t)=>{let n;switch(t.to){case 10:n=`vec4<f16>`;break;case 1:n=`vec4<f32>`;break;case 12:n=`vec4<u32>`;break;case 6:n=`vec4<i32>`;break;case 9:n=`vec4<bool>`;break;default:throw RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Z(e.inputs[0],`Cast`,n,void 0,t.cacheKey,t.to))},mi=e=>{let t,n,r=e.length>=2&&e[1].data!==0,i=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=r?e[1].getFloat32Array()[0]:-34028234663852886e22,n=i?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=r?e[1].getUint16Array()[0]:64511,n=i?e[2].getUint16Array()[0]:31743;break;default:throw Error(`Unsupport data type`)}return B({min:t,max:n})},hi=(e,t)=>{let n=t||mi(e.inputs),r=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`Clip`,e=>`clamp(${e}, vec4<${r}>(uniforms.min), vec4<${r}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:`min`,type:r},{name:`max`,type:r}]),{inputs:[0]})},gi=e=>{e.compute(Z(e.inputs[0],`Ceil`,`ceil`))},_i=e=>{e.compute(Z(e.inputs[0],`Cos`,`cos`))},vi=e=>{e.compute(Z(e.inputs[0],`Cosh`,`cosh`))},yi=e=>B(e),bi=(e,t)=>{let n=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`Elu`,e=>`elu_vf32(${e})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},xi=(e=`f32`)=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Si=e=>{let t=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`Erf`,e=>`erf_vf32(${e})`,xi(t)))},Ci=e=>{e.compute(Z(e.inputs[0],`Exp`,`exp`))},wi=e=>{e.compute(Z(e.inputs[0],`Floor`,`floor`))},Ti=e=>{let t=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`Gelu`,e=>`0.5 * ${e} * (1.0 + erf_vf32(${e} * 0.7071067811865475))`,xi(t)))},Ei=(e,t)=>{let n=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`LeakyRelu`,e=>`select(leaky_relu_alpha_ * ${e}, ${e}, ${e} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},Di=e=>{e.compute(Z(e.inputs[0],`Not`,e=>`!${e}`))},Oi=e=>{e.compute(Z(e.inputs[0],`Neg`,e=>`-${e}`))},ki=e=>{e.compute(Z(e.inputs[0],`Reciprocal`,e=>`1.0/${e}`))},Ai=e=>{let t=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`Relu`,e=>`select(vec4<${t}>(0.0), ${e}, ${e} > vec4<${t}>(0.0))`))},ji=e=>{e.compute(Z(e.inputs[0],`Sigmoid`,e=>`(1.0 / (1.0 + exp(-${e})))`))},Mi=e=>B(e),Ni=(e,t)=>{let n=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`HardSigmoid`,e=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${e} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},Pi=e=>{e.compute(Z(e.inputs[0],`Sin`,`sin`))},Fi=e=>{e.compute(Z(e.inputs[0],`Sinh`,`sinh`))},Ii=e=>{e.compute(Z(e.inputs[0],`Sqrt`,`sqrt`))},Li=e=>{e.compute(Z(e.inputs[0],`Tan`,`tan`))},Ri=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,zi=e=>{e.compute(Z(e.inputs[0],`Tanh`,Ri))},Bi=(e=`f32`)=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ri(`v`)};
}
`,Vi=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Hi=e=>{let t=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`FastGelu`,Vi,Bi(t),void 0,e.inputs[0].dataType))},Ui=(e,t)=>{let n=wn(e.inputs[0].dataType);return e.compute(Z(e.inputs[0],`ThresholdedRelu`,e=>`select(vec4<${n}>(0.0), ${e}, ${e} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},Wi=e=>{e.compute(Z(e.inputs[0],`Log`,`log`))},Gi=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Ki=e=>`quick_gelu_impl(${e})`,qi=(e,t)=>{let n=wn(e.inputs[0].dataType);e.compute(Z(e.inputs[0],`QuickGelu`,Ki,Gi(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Yi,Xi,Zi,Qi=o(()=>{z(),q(),Ji(),Yi=e=>{if(e[0].dims.length!==3)throw Error(`input should have 3 dimensions`);if(![2560,5120,10240].includes(e[0].dims[2]))throw Error(`hidden state should be 2560, 5120 or 10240`);if(e[1].dims.length!==1)throw Error(`bias is expected to have 1 dimensions`);if(e[0].dims[2]!==e[1].dims[0])throw Error(`last dimension of input and bias are not the same`)},Xi=e=>{let t=e[0].dims.slice();t[2]/=2;let n=G(`input`,e[0].dataType,e[0].dims,4),r=G(`bias`,e[0].dataType,[e[0].dims[2]],4),i=K(`output`,e[0].dataType,t,4),a=R.size(t)/4,o=Cn(e[0].dataType);return{name:`BiasSplitGelu`,getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:t=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${t.declareVariables(n,r,i)}

  ${xi(o)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${i.setByOffset(`global_idx`,`valueLeft * geluRight`)}
  }`}},Zi=e=>{Yi(e.inputs),e.compute(Xi(e.inputs))}}),$i,ea,ta,na,ra,ia,aa,oa,sa,ca,la,ua,da,fa=o(()=>{I(),z(),q(),$i=(e,t,n,r,i,a,o,s,c,l,u,d)=>{let f,p;typeof s==`string`?f=p=(e,t)=>`${s}((${e}),(${t}))`:typeof s==`function`?f=p=s:(f=s.scalar,p=s.vector);let m=K(`outputData`,u,r.length,4),h=G(`aData`,c,t.length,4),g=G(`bData`,l,n.length,4),_;if(i)if(a){let e=R.size(t)===1,r=R.size(n)===1,i=t.length>0&&t[t.length-1]%4==0,a=n.length>0&&n[n.length-1]%4==0;_=e||r?m.setByOffset(`global_idx`,p(e?`${h.type.value}(${h.getByOffset(`0`)}.x)`:h.getByOffset(`global_idx`),r?`${g.type.value}(${g.getByOffset(`0`)}.x)`:g.getByOffset(`global_idx`))):`
            let outputIndices = ${m.offsetToIndices(`global_idx * 4u`)};
            let offsetA = ${h.broadcastedIndicesToOffset(`outputIndices`,m)};
            let offsetB = ${g.broadcastedIndicesToOffset(`outputIndices`,m)};
            ${m.setByOffset(`global_idx`,p(o||i?h.getByOffset(`offsetA / 4u`):`${h.type.value}(${h.getByOffset(`offsetA / 4u`)}[offsetA % 4u])`,o||a?g.getByOffset(`offsetB / 4u`):`${g.type.value}(${g.getByOffset(`offsetB / 4u`)}[offsetB % 4u])`))}
          `}else _=m.setByOffset(`global_idx`,p(h.getByOffset(`global_idx`),g.getByOffset(`global_idx`)));else{if(!a)throw Error(`no necessary to use scalar implementation for element-wise binary op implementation.`);let e=(e,t,n=``)=>{let r=`aData[indexA${t}][componentA${t}]`,i=`bData[indexB${t}][componentB${t}]`;return`
            let outputIndices${t} = ${m.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offsetA${t} = ${h.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let offsetB${t} = ${g.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let indexA${t} = offsetA${t} / 4u;
            let indexB${t} = offsetB${t} / 4u;
            let componentA${t} = offsetA${t} % 4u;
            let componentB${t} = offsetB${t} % 4u;
            ${e}[${t}] = ${n}(${f(r,i)});
          `};_=u===9?`
            var data = vec4<u32>(0);
            ${e(`data`,0,`u32`)}
            ${e(`data`,1,`u32`)}
            ${e(`data`,2,`u32`)}
            ${e(`data`,3,`u32`)}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e(`outputData[global_idx]`,0)}
            ${e(`outputData[global_idx]`,1)}
            ${e(`outputData[global_idx]`,2)}
            ${e(`outputData[global_idx]`,3)}
          `}return`
        ${e.registerUniform(`vec_size`,`u32`).declareVariables(h,g,m)}

        ${d??``}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
        ${_}
      }`},ea=(e,t,n,r,i,a,o=n.dataType)=>{let s=n.dims.map(Number),c=r.dims.map(Number),l=!R.areEqual(s,c),u=s,d=R.size(s),f=!1,p=!1,m=[l];if(l){let e=zt.calcShape(s,c,!1);if(!e)throw Error(`Can't perform binary op on the given tensors`);u=e.slice(),d=R.size(u);let t=R.size(s)===1,n=R.size(c)===1,r=s.length>0&&s[s.length-1]%4==0,i=c.length>0&&c[c.length-1]%4==0;m.push(t),m.push(n),m.push(r),m.push(i);let a=1;for(let e=1;e<u.length;e++){let t=s[s.length-e];if(t===c[c.length-e])a*=t;else break}a%4==0?(p=!0,f=!0):(t||n||r||i)&&(f=!0)}else f=!0;return m.push(f),{name:e,shaderCache:{hint:t+m.map(e=>e.toString()).join(`_`),inputDependencies:[`rank`,`rank`]},getShaderSource:e=>$i(e,s,c,u,f,l,p,i,n.dataType,r.dataType,o,a),getRunData:()=>({outputs:[{dims:u,dataType:o}],dispatchGroup:{x:Math.ceil(d/64/4)},programUniforms:[{type:12,data:Math.ceil(R.size(u)/4)},...H(s,c,u)]})}},ta=(e,t,n,r,i,a)=>{e.compute(ea(t,i??``,e.inputs[0],e.inputs[1],n,r,a))},na=e=>{ta(e,`Add`,(e,t)=>`${e}+${t}`)},ra=e=>{ta(e,`Div`,(e,t)=>`${e}/${t}`)},ia=e=>{ta(e,`Equal`,{scalar:(e,t)=>`u32(${e}==${t})`,vector:(e,t)=>`vec4<u32>(${e}==${t})`},void 0,void 0,9)},aa=e=>{ta(e,`Mul`,(e,t)=>`${e}*${t}`)},oa=e=>{let t=G(`input`,e.inputs[0].dataType,e.inputs[0].dims).type.value;ta(e,`Pow`,{scalar:(e,t)=>`pow_custom(${e},${t})`,vector:(e,t)=>`pow_vector_custom(${e},${t})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t===`i32`?`round`:``}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},sa=e=>{ta(e,`Sub`,(e,t)=>`${e}-${t}`)},ca=e=>{ta(e,`Greater`,{scalar:(e,t)=>`u32(${e}>${t})`,vector:(e,t)=>`vec4<u32>(${e}>${t})`},void 0,void 0,9)},la=e=>{ta(e,`Less`,{scalar:(e,t)=>`u32(${e}<${t})`,vector:(e,t)=>`vec4<u32>(${e}<${t})`},void 0,void 0,9)},ua=e=>{ta(e,`GreaterOrEqual`,{scalar:(e,t)=>`u32(${e}>=${t})`,vector:(e,t)=>`vec4<u32>(${e}>=${t})`},void 0,void 0,9)},da=e=>{ta(e,`LessOrEqual`,{scalar:(e,t)=>`u32(${e}<=${t})`,vector:(e,t)=>`vec4<u32>(${e}<=${t})`},void 0,void 0,9)}}),pa,ma,ha,ga,_a,va,ya=o(()=>{I(),z(),V(),q(),pa=(e,t)=>{if(!e||e.length<1)throw Error(`too few inputs`);let n=e[0],r=n.dataType,i=n.dims.length;e.forEach((e,a)=>{if(a!==0){if(e.dataType!==r)throw Error(`input tensors should be one type`);if(e.dims.length!==i)throw Error(`input tensors should have the same shape`);e.dims.forEach((e,r)=>{if(r!==t&&e!==n.dims[r])throw Error(`non concat dimensions must match`)})}})},ma=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,ha=(e,t)=>{let n=e.length,r=[];for(let i=0;i<n;++i){let a=t.setByOffset(`global_idx`,e[i].getByIndices(`indices`));n===1?r.push(a):i===0?r.push(`if (inputIndex == ${i}u) { ${a} }`):i===n-1?r.push(`else { ${a} }`):r.push(`else if (inputIndex == ${i}) { ${a} }`)}return r.join(`
`)},ga=(e,t,n,r)=>{let i=R.size(n),a=Array(e.length),o=Array(e.length),s=0,c=[],l=[],u=[{type:12,data:i}];for(let n=0;n<e.length;++n)s+=e[n].dims[t],a[n]=s,l.push(e[n].dims.length),o[n]=G(`input${n}`,r,l[n]),c.push(`rank`),u.push({type:12,data:a[n]});for(let t=0;t<e.length;++t)u.push(...H(e[t].dims));u.push(...H(n));let d=K(`output`,r,n.length),f=d.indicesGet(`indices`,t),p=Array.from(Array(a.length).keys()).map(e=>`uniforms.sizeInConcatAxis${e}`).join(`,`);return{name:`Concat`,shaderCache:{hint:`${t}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:n,dataType:r}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:u}),getShaderSource:t=>`

  ${(()=>{t.registerUniform(`outputSize`,`u32`);for(let n=0;n<e.length;n++)t.registerUniform(`sizeInConcatAxis${n}`,`u32`);return t.declareVariables(...o,d)})()}

  ${ma(a.length,p)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

    var indices = ${d.offsetToIndices(`global_idx`)};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${p});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${ha(o,d)}
  }`}},_a=(e,t)=>{let n=e.inputs,r=n[0].dims,i=R.normalizeAxis(t.axis,r.length);pa(n,i);let a=r.slice();a[i]=n.reduce((e,t)=>e+(t.dims.length>i?t.dims[i]:0),0);let o=n.filter(e=>R.size(e.dims)>0);e.compute(ga(o,i,a,n[0].dataType),{inputs:o})},va=e=>B({axis:e.axis})}),ba,xa,Sa,Ca,wa=o(()=>{I(),z(),ba=(e,t,n=`f32`)=>{switch(e.activation){case`Relu`:return`value = max(value, ${t}(0.0));`;case`Sigmoid`:return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case`Clip`:return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case`HardSigmoid`:return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case`LeakyRelu`:return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case`Tanh`:return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case``:return``;default:throw Error(`Unsupported activation ${e.activation}`)}},xa=(e,t)=>{e.activation===`Clip`?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation===`HardSigmoid`?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation===`LeakyRelu`&&t.push({type:1,data:e.alpha})},Sa=(e,t)=>{e.activation===`Clip`?t.push({name:`clip_max`,type:`f32`},{name:`clip_min`,type:`f32`}):e.activation===`HardSigmoid`?t.push({name:`alpha`,type:`f32`},{name:`beta`,type:`f32`}):e.activation===`LeakyRelu`&&t.push({name:`alpha`,type:`f32`})},Ca=e=>{let t=e?.activation||``;if(t===`HardSigmoid`){let[n,r]=e?.activation_params||[.2,.5];return{activation:t,alpha:n,beta:r}}else if(t===`Clip`){let[n,r]=e?.activation_params||[Ht,Ut];return{activation:t,clipMax:r,clipMin:n}}else if(t===`LeakyRelu`){let[n]=e?.activation_params||[.01];return{activation:t,alpha:n}}return{activation:t}}}),Ta,Ea,Da=o(()=>{Ta=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw Error(`${e}-component is not supported.`)}},Ea=e=>`
      ${e?`value = value + getBiasByOutputCoords(coords);`:``}
      `}),Oa,ka=o(()=>{Oa=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Aa,ja,Ma=o(()=>{I(),z(),q(),wa(),Aa=(e,t,n,r,i)=>{let a=r-n;return`
      ${Array.from({length:n}).map((n,o)=>`
      if (${W(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,W(i,o+a,r))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join(``)}
`},ja=(e,t,n,r,i=!1,a)=>{let o=e[0].dims,s=e[1].dims,c=o[o.length-2],l=s[s.length-1],u=o[o.length-1],d=U(l),f=U(u),p=U(c),m=R.size(n)/d/p,h=e.length>2,g=r?r.slice(0,-2):n.slice(0,-2),_=[R.size(g),c,l],v=[{type:12,data:m},{type:12,data:c},{type:12,data:l},{type:12,data:u}];return xa(t,v),v.push(...H(g,o,s)),h&&v.push(...H(e[2].dims)),v.push(...H(_)),{name:`MatMulNaive`,shaderCache:{hint:`${t.activation};${d};${f};${p};${i}`,inputDependencies:h?[`rank`,`rank`,`rank`]:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:v}),getShaderSource:r=>{let a=An(`batch_dims`,e[0].dataType,g.length),c=G(`a`,e[0].dataType,o.length,f),l=G(`b`,e[1].dataType,s.length,d),u=K(`output`,e[0].dataType,_.length,d),m=Cn(u.type.tensor),v=ba(t,u.type.value,m),y=[c,l],b=``;if(h){let t=i?d:1;y.push(G(`bias`,e[2].dataType,e[2].dims.length,t)),b=`${i?`value += bias[col / ${t}];`:`value += ${u.type.value}(bias[row + i]);`}`}let x=[{name:`output_size`,type:`u32`},{name:`M`,type:`u32`},{name:`N`,type:`u32`},{name:`K`,type:`u32`}];Sa(t,x);let S=()=>{let e=`var a_data: ${c.type.value};`;for(let t=0;t<f;t++)e+=`
              let b_data${t} = b[(b_offset + (k + ${t}) * uniforms.N + col) / ${d}];`;for(let t=0;t<p;t++){e+=`a_data = a[(a_offset + (row + ${t}) * uniforms.K + k) / ${f}];`;for(let n=0;n<f;n++)e+=`
            values[${t}] = fma(${l.type.value}(a_data${f===1?``:`[${n}]`}), b_data${n}, values[${t}]);
`}return e};return`
  ${r.registerUniforms(x).registerInternalVariables(a).declareVariables(...y,u)}
  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let col = (global_idx % (uniforms.N / ${d})) * ${d};
    var index1 = global_idx / (uniforms.N / ${d});
    let stride1 = uniforms.M / ${p};
    let row = (index1 % stride1) * ${p};
    let batch = index1 / stride1;

    ${n.length===2?``:`let batch_indices = ${a.offsetToIndices(`batch`)};`}

    var a_indices: ${c.type.indices};
    ${Aa(`a_indices`,c,c.rank-2,a.rank,`batch_indices`)}
    ${c.indicesSet(`a_indices`,c.rank-2,0)}
    ${c.indicesSet(`a_indices`,c.rank-1,0)}
    let a_offset = ${c.indicesToOffset(`a_indices`)};

    var b_indices: ${l.type.indices};
    ${Aa(`b_indices`,l,l.rank-2,a.rank,`batch_indices`)}
    ${l.indicesSet(`b_indices`,l.rank-2,0)}
    ${l.indicesSet(`b_indices`,l.rank-1,0)}
    let b_offset = ${l.indicesToOffset(`b_indices`)};
    var values: array<${u.type.value}, ${p}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${S()}
    }
    for (var i = 0u; i < ${p}u; i++) {
      var value = values[i];
      ${b}
      ${v}
      let cur_indices = ${u.type.indices}(batch, row + i, col);
      let offset = ${u.indicesToOffset(`cur_indices`)};
      ${u.setByOffset(`offset / ${d}`,`value`)};
    }
  }
  `}}}}),Na,Pa,Fa,Ia,La,Ra,za,Ba,Va=o(()=>{I(),z(),q(),wa(),Ma(),Da(),Na=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?`, batchIndices`:``});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?`, batchIndices`:``});
        `,Pa=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?``:`let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];`}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?``:`acc[i] = BCached3 * ACached3[i] + acc[i];`}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?``:`acc[i] = BCached3 * ACached.w + acc[i];`}
        }`,Fa=(e,t,n=`f32`,r,i=!1,a=32,o=!1,s=32)=>{let c=t[1]*e[1],l=t[0]*e[0],u=i?c:a,d=i?a:c,f=u/t[0],p=a/t[1];if(!((i&&f===4&&e[1]===4||!i&&(f===3||f===4))&&u%t[0]===0&&a%t[1]===0&&e[0]===4))throw Error(`If transposeA ${i} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${u} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${n}>, ${u/f}>, ${d}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${l/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${o?`0`:`i32(globalId.z)`};
  ${r?`let batchIndices = ${r.offsetToIndices(`u32(batch)`)};`:``}
  let globalRowStart = i32(workgroupId.y) * ${c};

  let num_tiles = ${o?`${Math.ceil(s/a)}`:`(uniforms.dim_inner - 1) / tileInner + 1`};
  var kStart = ${o?`i32(globalId.z) * ${s}`:`0`};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${p};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Na(i,r)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${p}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${r?`, batchIndices`:``});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${f===3?``:`let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];`}

          ${Pa(i,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Ia=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?`, batchIndices`:``});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?`, batchIndices`:``});
            `,La=e=>e?`let ACached = mm_Asub[k][tileRow + innerRow];`:`let ACached = mm_Asub[tileRow + innerRow][k];`,Ra=(e,t,n=`f32`,r,i=!1,a=32,o=!1,s=32,c=!1)=>{let l=e[1]*t[1],u=e[0]*t[0],d=i?l:a,f=i?a:l;if(!(f%t[1]===0&&d%t[0]===0&&a%t[1]===0))throw Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let p=f/t[1],m=d/t[0],h=a/t[1],g=c?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${u};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
          ${Ia(i,r)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${u}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${r?`, batchIndices`:``});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${i?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${p};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${h};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${p}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Ia(i,r)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${r?`, batchIndices`:``});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${La(i)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${d}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${u}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${o?`0`:`i32(globalId.z)`};
    ${r?`let batchIndices = ${r.offsetToIndices(`u32(batch)`)};`:``}
    let num_tiles = ${o?`${Math.ceil(s/a)}`:`(uniforms.dim_inner - 1) / tileInner + 1`};
    var kStart = ${o?`i32(globalId.z) * ${s}`:`0`};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${g}
  }
`},za=(e,t,n,r,i=!1)=>{let[a,o,s,c]=r,l=Cn(r[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ta(e,l)} {
      var value = ${Ta(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${o.type.indices};
        ${Aa(`aIndices`,o,o.rank-2,a.rank,`batchIndices`)}
        ${o.indicesSet(`aIndices`,o.rank-2,`u32(row)`)}
        ${o.indicesSet(`aIndices`,o.rank-1,`u32(colIn)`)}
        value = ${o.getByIndices(`aIndices`)};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ta(e,l)} {
      var value = ${Ta(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${s.type.indices};
        ${Aa(`bIndices`,s,s.rank-2,a.rank,`batchIndices`)}
        ${s.indicesSet(`bIndices`,s.rank-2,`u32(row)`)}
        ${s.indicesSet(`bIndices`,s.rank-1,`u32(colIn)`)}
        value = ${s.getByIndices(`bIndices`)};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ta(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${i?`bias[colIn]`:`${Ta(e,l)}(bias[row])`};`:``}
        ${n}
        ${c.setByIndices(`vec3<u32>(coords)`,`value`)}
      }
    }
    `},Ba=(e,t,n,r,i=!1,a)=>{let o=e[0].dims,s=e[1].dims,c=o.slice(0,-2),l=s.slice(0,-2),u=r?r.slice(0,-2):n.slice(0,-2),d=R.size(u),f=o[o.length-2],p=o[o.length-1],m=s[s.length-1],h=p%4==0&&m%4==0,g=f<=8?[4,1,1]:[4,4,1],_=[8,8,1],v=[Math.ceil(m/_[0]/g[0]),Math.ceil(f/_[1]/g[1]),Math.ceil(d/_[2]/g[2])],y=h?4:1,b=[...c,f,p/y],x=b.length,S=[...l,p,m/y],C=S.length,w=[d,f,m/y],ee=[{type:6,data:f},{type:6,data:m},{type:6,data:p}];xa(t,ee),ee.push(...H(u,b,S));let T=[`rank`,`rank`],E=e.length>2;return E&&(ee.push(...H(e[2].dims)),T.push(`rank`)),ee.push(...H(w)),{name:`MatMul`,shaderCache:{hint:`${g};${t.activation};${h};${i}`,inputDependencies:T},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:ee}),getShaderSource:n=>{let r=u.length,a=An(`batchDims`,e[0].dataType,r,1),o=Cn(e[0].dataType),s=G(`a`,e[0].dataType,x,y),c=G(`b`,e[1].dataType,C,y),l=K(`result`,e[0].dataType,w.length,y),d=[s,c];if(E){let t=i?y:1;d.push(G(`bias`,e[2].dataType,e[2].dims.length,t))}let f=[{name:`dim_a_outer`,type:`i32`},{name:`dim_b_outer`,type:`i32`},{name:`dim_inner`,type:`i32`}];Sa(t,f);let p=Cn(l.type.tensor),m=ba(t,l.type.value,p),v=za(y,E,m,[a,s,c,l],i);return`
  ${n.registerUniforms(f).registerInternalVariables(a).declareVariables(...d,l)}
  ${v}
  ${h?Fa(g,_,o,a):Ra(g,_,o,a)}
                   `}}}}),Ha,Ua,Wa=o(()=>{I(),Lt(),q(),wa(),Da(),ka(),Va(),Ha=(e,t,n,r,i=!1,a,o=4,s=4,c=4,l=`f32`)=>{let u=e=>{switch(e){case 1:return`resData = x[xIndex];`;case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return`resData = x[xIndex / 4];`;default:throw Error(`innerElementSize ${e} is not supported.`)}},d=e=>{switch(e){case 1:return`return w[row * i32(uniforms.w_shape[3]) + colIn];`;case 4:return`return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];`;default:throw Error(`innerElementSize ${e} is not supported.`)}},f=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,p=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,m=e?`i32(uniforms.x_shape[1])`:`i32(uniforms.x_shape[2])`,h=e?`i32(uniforms.x_shape[2])`:`i32(uniforms.x_shape[3])`,g=e?`row`:`col`,_=e?`col`:`row`,v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?`i32(uniforms.result_shape[2])`:`i32(uniforms.result_shape[3])`};
    let outRow = ${g} / outWidth;
    let outCol = ${g} % outWidth;

    let WRow = ${_} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${_} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${_} % inChannels;
    var resData = ${Ta(o,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${h}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${u(o)}
    }
    return resData;`,y=e?t&&r?`
    let col = colIn * ${o};
    ${v}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${Ta(o,l)}(0.0);`:r&&n?`
    let col = colIn * ${o};
    ${v}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${Ta(o,l)}(0.0);`,b=e?r&&n?d(s):`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${d(s)}
    }
    return ${Ta(s,l)}(0.0);`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${d(s)}
    }
    return ${Ta(s,l)}(0.0);`,x=Ta(c,l),S=Ta(e?o:s,l),C=Ta(e?s:o,l),w=ba(a,x,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${S} {
      ${e?y:b}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?b:y}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${x}) {
      let col = colIn * ${c};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?`i32(uniforms.result_shape[2])`:`i32(uniforms.result_shape[3])`};
      ${p}
      ${Ea(i)}
      ${w}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Ua=(e,t,n,r,i,a,o,s,c)=>{let l=t.format===`NHWC`,u=l?e[0].dims[3]:e[0].dims[1],d=n[0],f=l?n[2]:n[3],p=l?n[1]:n[2],m=l?n[3]:n[1],h=l&&(u%4==0||u%3==0)&&m%4==0,g=l?m:f*p,_=l?f*p:m,v=[8,8,1],y=r<=8?[4,1,1]:[4,4,1],b=[Math.ceil(g/v[0]/y[0]),Math.ceil(_/v[1]/y[1]),Math.ceil(d/v[2]/y[2])];L(`verbose`,()=>`[conv2d_mm_webgpu] dispatch = ${b}`);let x=h?l&&u%4!=0?3:4:1,S=v[1]*y[1],C=v[0]*y[0],w=Math.max(v[0]*x,v[1]),ee=r%S===0,T=i%C===0,E=a%w===0,te=h?[x,4,4]:[1,1,1],ne=[{type:6,data:r},{type:6,data:i},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];xa(t,ne),ne.push(...H(e[0].dims,e[1].dims));let D=[`rank`,`rank`];return o&&(ne.push(...H(e[2].dims)),D.push(`rank`)),ne.push(...H(n)),{name:`Conv2DMatMul`,shaderCache:{hint:`${t.cacheKey};${x};${h};${ee};${T};${E};${S};${C};${w}`,inputDependencies:D},getRunData:()=>({outputs:[{dims:c?c(n):n,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:ne}),getShaderSource:r=>{let i=[{name:`dim_a_outer`,type:`i32`},{name:`dim_b_outer`,type:`i32`},{name:`dim_inner`,type:`i32`},{name:`pad`,type:`i32`,length:2},{name:`stride`,type:`i32`,length:2},{name:`dilation`,type:`i32`,length:2}];Sa(t,i);let a=h?4:1,c=Cn(e[0].dataType),u=`
      fn setOutputAtIndex(flatIndex : i32, value : ${h?`vec4<${c}>`:c}) {
        result[flatIndex] = ${h?`vec4<${c}>`:c}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${h?`vec4<${c}>`:c}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${h?`/ 4`:``}, value);
      }`,d=[G(`x`,e[0].dataType,e[0].dims.length,x===3?1:x),G(`w`,e[1].dataType,e[1].dims.length,a)],f=K(`result`,e[0].dataType,n.length,a);if(o){let t=G(`bias`,e[2].dataType,e[2].dims.length,a);d.push(t),u+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${h?`vec4<${c}>`:c} {
          return bias[coords.${l?`w`:`y`}${h?`/ 4`:``}];
        }`}return`
        ${Oa(`uniforms.result_strides`)}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${r.registerUniforms(i).declareVariables(...d,f)}
        ${u}
        ${Ha(l,ee,T,E,o,t,te[0],te[1],te[2],c)}
        ${h?Fa(y,v,c,void 0,!l,w):Ra(y,v,c,void 0,!l,w,!1,void 0,s)}`}}}}),Ga,Ka,qa,Ja,Ya,Xa,Za,Qa,$a=o(()=>{I(),Lt(),z(),q(),wa(),Da(),Ga=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},Ka=e=>typeof e==`number`?[e,e,e]:e,qa=(e,t)=>t<=1?e:e+(e-1)*(t-1),Ja=(e,t,n,r=1)=>{let i=qa(t,r);return Math.floor((e[0]*(n-1)-n+i)/2)},Ya=(e,t,n,r,i)=>{i??=Ja(e,t[0],r[0]);let a=[0,0,0,n];for(let n=0;n<3;n++)e[n]+2*i>=t[n]&&(a[n]=Math.trunc((e[n]-t[n]+2*i)/r[n]+1));return a},Xa=(e,t,n,r,i,a,o,s,c,l)=>{let u,d,f,p;if(e===`VALID`&&(e=0),typeof e==`number`){u={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=Ya([t,n,r,1],[s,c,l],1,[i,a,o],e);d=m[0],f=m[1],p=m[2]}else if(Array.isArray(e)){if(!e.every((e,t,n)=>e===n[0]))throw Error(`Unsupported padding parameter: ${e}`);u={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=Ya([t,n,r,1],[s,c,l],1,[i,a,o],e[0]);d=m[0],f=m[1],p=m[2]}else if(e===`SAME_UPPER`){d=Math.ceil(t/i),f=Math.ceil(n/a),p=Math.ceil(r/o);let e=(d-1)*i+s-t,m=(f-1)*a+c-n,h=(p-1)*o+l-r,g=Math.floor(e/2),_=e-g,v=Math.floor(m/2),y=m-v,b=Math.floor(h/2);u={top:v,bottom:y,left:b,right:h-b,front:g,back:_}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:u,outDepth:d,outHeight:f,outWidth:p}},Za=(e,t,n,r,i,a=!1,o=`channelsLast`)=>{let s,c,l,u,d;if(o===`channelsLast`)[s,c,l,u,d]=e;else if(o===`channelsFirst`)[s,d,c,l,u]=e;else throw Error(`Unknown dataFormat ${o}`);let[f,,p,m,h]=t,[g,_,v]=Ka(n),[y,b,x]=Ka(r),S=qa(p,y),C=qa(m,b),w=qa(h,x),{padInfo:ee,outDepth:T,outHeight:E,outWidth:te}=Xa(i,c,l,u,g,_,v,S,C,w),ne=a?f*d:f,D=[0,0,0,0,0];return o===`channelsFirst`?D=[s,ne,T,E,te]:o===`channelsLast`&&(D=[s,T,E,te,ne]),{batchSize:s,dataFormat:o,inDepth:c,inHeight:l,inWidth:u,inChannels:d,outDepth:T,outHeight:E,outWidth:te,outChannels:ne,padInfo:ee,strideDepth:g,strideHeight:_,strideWidth:v,filterDepth:p,filterHeight:m,filterWidth:h,effectiveFilterDepth:S,effectiveFilterHeight:C,effectiveFilterWidth:w,dilationDepth:y,dilationHeight:b,dilationWidth:x,inShape:e,outShape:D,filterShape:t}},Qa=(e,t,n,r,i,a)=>{let o=a===`channelsLast`;o?e[0].dims[3]:e[0].dims[1];let s=[64,1,1],c={x:n.map((e,t)=>t)},l=[Math.ceil(Ga(c.x.map(e=>n[e]))/s[0]),1,1];L(`verbose`,()=>`[conv3d_naive_webgpu] dispatch = ${l}`);let u=[{type:12,data:R.size(n)},{type:12,data:r},{type:12,data:i},{type:12,data:t.strides},{type:12,data:t.dilations}];xa(t,u),u.push(...H(e[0].dims,e[1].dims));let d=[`rank`,`rank`],f=e.length===3;return f&&(u.push(...H(e[2].dims)),d.push(`rank`)),u.push(...H(n)),{name:`Conv3DNaive`,shaderCache:{hint:`${t.cacheKey};${o};1;${f}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:l[0],y:l[1],z:l[2]},programUniforms:u}),getShaderSource:a=>{let s=[{name:`output_size`,type:`u32`},{name:`filter_dims`,type:`u32`,length:r.length},{name:`pads`,type:`u32`,length:i.length},{name:`strides`,type:`u32`,length:t.strides.length},{name:`dilations`,type:`u32`,length:t.dilations.length}];Sa(t,s);let c=Cn(e[0].dataType),l=G(`x`,e[0].dataType,e[0].dims.length,1),u=G(`W`,e[1].dataType,e[1].dims.length,1),d=[l,u],p=K(`result`,e[0].dataType,n.length,1),m=``;if(f){let t=G(`bias`,e[2].dataType,e[2].dims.length,1);d.push(t),m+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${c} {
          return bias[${o?W(`coords`,4,5):W(`coords`,1,5)}];
        }`}let h=Ta(1,c),g=ba(t,h,c);return`
            ${m}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${l.getByIndices(`aIndices`)};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${u.getByIndices(`aIndices`)};
            }
          ${a.registerUniforms(s).declareVariables(...d,p)}
          ${a.mainStart()}
          ${a.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
              let coords = ${p.offsetToIndices(`global_idx`)};
              let batch = ${W(`coords`,0,l.rank)};
              let d2 = ${o?W(`coords`,l.rank-1,l.rank):W(`coords`,1,l.rank)};
              let xFRCCorner = vec3<u32>(${o?W(`coords`,1,l.rank):W(`coords`,2,l.rank)},
              ${o?W(`coords`,2,l.rank):W(`coords`,3,l.rank)},
              ${o?W(`coords`,3,l.rank):W(`coords`,4,l.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${o?W(`uniforms.x_shape`,1,l.rank):W(`uniforms.x_shape`,2,l.rank)};
              let xShapeZ = ${o?W(`uniforms.x_shape`,2,l.rank):W(`uniforms.x_shape`,3,l.rank)};
              let xShapeW = ${o?W(`uniforms.x_shape`,3,l.rank):W(`uniforms.x_shape`,4,l.rank)};
              let xShapeU = ${o?W(`uniforms.x_shape`,4,l.rank):W(`uniforms.x_shape`,1,l.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${o?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${o?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${o?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${o?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${f?`value = value + getBiasByOutputCoords(coords)`:``};
              ${g}
              result[global_idx] = f32(value);
          }`}}}}),eo,to,no=o(()=>{I(),z(),q(),wa(),eo=(e,t,n,r)=>{let i=e.length>2,a=i?`value += b[output_channel];`:``,o=e[0].dims,s=e[1].dims,c=t.format===`NHWC`,l=c?n[3]:n[1],u=l/t.group,d=c&&u>=4?U(l):1,f=R.size(n)/d,p=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:u}];xa(t,p),p.push(...H(o,[s[0],s[1],s[2],s[3]/d]));let m=i?[`rank`,`rank`,`rank`]:[`rank`,`rank`];return p.push(...H([n[0],n[1],n[2],n[3]/d])),{name:`GroupedConv`,shaderCache:{hint:`${t.cacheKey}_${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:p}),getShaderSource:r=>{let l=K(`output`,e[0].dataType,n.length,d),u=Cn(l.type.tensor),f=ba(t,l.type.value,u),p=G(`x`,e[0].dataType,o.length),m=G(`w`,e[1].dataType,s.length,d),h=[p,m];i&&h.push(G(`b`,e[2].dataType,e[2].dims,d));let g=[{name:`output_size`,type:`u32`},{name:`dilations`,type:`u32`,length:t.dilations.length},{name:`strides`,type:`u32`,length:2},{name:`pads`,type:`u32`,length:2},{name:`output_channels_per_group`,type:`u32`}];Sa(t,g);let _=c?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${p.get(`batch`,`xHeight`,`xWidth`,`input_channel`)};
            let wVal = ${m.get(`wHeight`,`wWidth`,`wInChannel`,`output_channel`)};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${p.get(`batch`,`input_channel`,`xHeight`,`xWidth`)};
            let wVal = ${m.get(`output_channel`,`wInChannel`,`wHeight`,`wWidth`)};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${r.registerUniforms(g).declareVariables(...h,l)}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let outputIndices = ${l.offsetToIndices(`global_idx`)};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${c?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${c?1:2}], outputIndices[${c?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${d} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${c?2:1}];

    var value: ${l.type.value} = ${l.type.value}(0);
    ${_}
    ${a}
    ${f}
    ${l.setByOffset(`global_idx`,`value`)}
  }`}}},to=(e,t,n,r)=>{let i=e.length>2,a=U(n[3]),o=U(n[2]),s=R.size(n)/a/o,c=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],u=[n[0],n[1],n[2],n[3]/a],d=[{type:12,data:s},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];xa(t,d),d.push(...H(c,l,u));let f=(o-1)*t.strides[1]+l[1];return{name:`GroupedConv-Vectorize`,shaderCache:{hint:`${t.cacheKey};${a};${o};${f};${l[0]};${l[1]}`,inputDependencies:i?[`rank`,`rank`,`type`]:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:n=>{let r=K(`output`,e[0].dataType,u.length,a),s=Cn(r.type.tensor),d=ba(t,r.type.value,s),p=G(`x`,e[0].dataType,c.length,a),m=G(`w`,e[1].dataType,l.length,a),h=[p,m];i&&h.push(G(`b`,e[2].dataType,e[2].dims,a));let g=i?`value += b[output_channel];`:``,_=[{name:`output_size`,type:`u32`},{name:`strides`,type:`i32`,length:2},{name:`pads`,type:`i32`,length:2}];return Sa(t,_),`
  ${n.registerUniforms(_).declareVariables(...h,r)}
  ${n.mainStart()}
    ${n.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${o}u;
    let col = (index1 % width1) * ${o}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${p.type.value}, ${f}>;
    var values: array<${r.type.value}, ${o}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${p.get(`batch`,`u32(x_height)`,`u32(x_width)`,`input_channel`)};
          } else {
            x_vals[i] = ${p.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${m.get(`w_height`,`w_width`,`0`,`output_channel`)};
          for (var i = 0u; i < ${o}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${o}u; i++) {
      var value = values[i];
      ${g}
      ${d}
      ${r.set(`batch`,`row`,`col + i`,`output_channel`,`value`)};
    }
  }`}}}}),ro,io,ao,oo,so,co,lo,uo,fo,po=o(()=>{z(),Wa(),$a(),Va(),no(),wa(),Ma(),Hn(),ro=(e,t,n,r,i,a)=>{let o=e[0],s=e.slice(a?1:2,a?3:4),c=s.length,l=t[0],u=t.slice(2).map((e,t)=>e+(e-1)*(n[t]-1)),d=s.map((e,t)=>e+r[t]+r[t+c]).map((e,t)=>Math.floor((e-u[t]+i[t])/i[t]));return d.splice(0,0,o),d.splice(a?3:1,0,l),d},io=[2,3,1,0],ao=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw Error(`Conv requires 2 or 3 inputs`);if(e[0].dims.length>5)throw Error(`greater than 5D is not supported`);if(e[0].dims.length!==e[1].dims.length)throw Error(`filter does not have same dimension as input`);if(e[0].dims[t.format===`NHWC`?e[0].dims.length-1:1]!==e[1].dims[1]*t.group)throw Error(`FILTER_IN_CHANNEL should be equal to DATA_CHANNEL`);if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw Error(`invalid bias`);let n=e[0].dims.length-2;if(t.dilations.length!==n)throw Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw Error(`invalid kernel shape`)},oo=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let e=2;e<t[1].dims.length;++e)n[e-2]===0&&(n[e-2]=t[1].dims[e]);let r=e.pads.slice();Bt.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,r,e.format===`NHWC`,e.autoPad);let i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:r}),i},so=e=>{let t=Ca(e),n=e.format;return{autoPad:[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][e.auto_pad],format:n,dilations:e.dilations,group:e.group,kernelShape:e.kernel_shape,pads:e.pads,strides:e.strides,wIsConst:e.w_is_const(),...t,cacheKey:`${e.format};${t.activation};`}},co=(e,t,n,r)=>{let i=n.format===`NHWC`,a=ro(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,i);if(n.group!==1){let o=[t[0]];if(i){let r=e.kernelCustomData.wT??e.compute(zn(t[1],io),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=r),o.push(r)}else o.push(t[1]);t.length===3&&o.push(t[2]),!e.adapterInfo.isArchitecture(`ampere`)&&i&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(to(o,n,a,r),{inputs:o}):e.compute(eo(o,n,a,r),{inputs:o});return}let o=t.length===3,s=t[0].dims[i?1:2],c=t[0].dims[i?2:3],l=t[0].dims[i?3:1],u=t[1].dims[2],d=t[1].dims[3],f=a[i?1:2],p=a[i?2:3],m=a[i?3:1],h=i&&u===s&&d===c&&n.pads[0]===0&&n.pads[1]===0;if(h||u===1&&d===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let u=a[0],d,g,_,v=[];if(i){let r=e.kernelCustomData.wT??e.compute(zn(t[1],io),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=r),h){let e=s*c*l;d=t[0].reshape([1,u,e]),g=r.reshape([1,e,m]),_=[1,u,m]}else d=t[0].reshape([u,s*c,l]),g=r.reshape([1,l,m]),_=[u,f*p,m];v.push(d),v.push(g)}else d=t[0].reshape([u,l,s*c]),g=t[1].reshape([1,m,l]),_=[u,m,f*p],v.push(g),v.push(d);o&&v.push(t[2]);let y=_[2],b=v[0].dims[v[0].dims.length-1];y<8&&b<8?e.compute(ja(v,n,a,_,i,r),{inputs:v}):e.compute(Ba(v,n,a,_,i,r),{inputs:v});return}let g=e.kernelCustomData.wT??e.compute(zn(t[1],io),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=g);let _=[t[0],g];o&&_.push(t[2]);let v=i?f*p:m,y=i?m:f*p,b=u*d*l;e.compute(Ua(_,n,a,v,y,b,o,!0,r),{inputs:_})},lo=(e,t)=>{let n=t.format===`NHWC`,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let i=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),o=[1].concat(t.dilations),s=[1].concat(t.kernelShape),c=oo({...t,pads:i,strides:a,dilations:o,kernelShape:s},r);co(e,r,c,e=>n?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},uo=(e,t,n)=>{let r=n.format===`NHWC`?`channelsLast`:`channelsFirst`,i=oo(n,t),a=n.autoPad===`NOTSET`?n.pads:n.autoPad,o=Za(t[0].dims,t[1].dims,n.strides,n.dilations,a,!1,r);e.compute(Qa(t,i,o.outShape,[o.filterDepth,o.filterHeight,o.filterWidth],[o.padInfo.front,o.padInfo.top,o.padInfo.left],r))},fo=(e,t)=>{if(ao(e.inputs,t),e.inputs[0].dims.length===3)lo(e,t);else if(e.inputs[0].dims.length===5)uo(e,e.inputs,t);else{let n=oo(t,e.inputs);co(e,e.inputs,n)}}}),mo,ho=o(()=>{I(),Lt(),z(),q(),mo=(e,t,n)=>{let r=e.length>2,i=t.outputShape,a=t.format===`NHWC`,o=t.group,s=e[1].dims,c=s[2]/o,l=s[3],u=a?U(c):1,d=a&&l===1&&c>=4,f=d?Math.floor(c/4)*4:Math.floor(c/u)*u,p=c-f,m=a?U(l):1,h=a?l===1?u:m:1,g=R.size(i)/m,_=[Math.ceil(g/64),1,1];L(`verbose`,()=>`[conv2d_backprop_webgpu] dispatch = ${_}`);let v=[`rank`,`rank`],y=[t.strides[0],t.strides[1]],b=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],x=[t.dilations[0],t.dilations[1]],S=[b[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),b[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],C=[S[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),S[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],w=[{type:12,data:g},{type:12,data:y},{type:12,data:b},{type:12,data:x},{type:12,data:S},{type:6,data:C},{type:12,data:f},{type:12,data:c},{type:12,data:l},...H(e[0].dims,e[1].dims)];return r&&(w.push(...H(e[2].dims)),v.push(`rank`)),w.push(...H(i)),{name:`ConvTranspose2D`,shaderCache:{hint:`${t.cacheKey};${u}${h}${m}${d}${p}`,inputDependencies:v},getRunData:()=>({dispatchGroup:{x:_[0],y:_[1],z:_[2]},outputs:[{dims:n?n(i):i,dataType:e[0].dataType}],programUniforms:w}),getShaderSource:t=>{let n=[{name:`output_size`,type:`u32`},{name:`strides`,type:`u32`,length:y.length},{name:`filter_dims`,type:`u32`,length:b.length},{name:`dilations`,type:`u32`,length:b.length},{name:`effective_filter_dims`,type:`u32`,length:S.length},{name:`pads`,type:`i32`,length:C.length},{name:`input_channels_per_group_int`,type:`u32`},{name:`input_channels_per_group`,type:`u32`},{name:`output_channels_per_group`,type:`u32`}],o=Cn(e[0].dataType),s=a?1:2,c=a?2:3,l=a?3:1,f=G(`W`,e[1].dataType,e[1].dims.length,h),g=G(`Dy`,e[0].dataType,e[0].dims.length,u),_=[g,f];r&&_.push(G(`bias`,e[2].dataType,[i[l]].length,m));let v=K(`result`,e[0].dataType,i.length,m),x=`
            let outputIndices = ${v.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${v.indicesGet(`outputIndices`,0)};
            let d1 = ${v.indicesGet(`outputIndices`,l)};
            let r = ${v.indicesGet(`outputIndices`,s)};
            let c = ${v.indicesGet(`outputIndices`,c)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${v.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${o}(dyRCorner) + ${o}(wR)) / ${o}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${o}(uniforms.Dy_shape[${s}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${o}(dyCCorner) + ${o}(wC)) / ${o}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${o}(uniforms.Dy_shape[${c}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${d?`
                var x_offset = ${g.indicesToOffset(`${g.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${u};
                var w_offset = ${f.indicesToOffset(`${f.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${h};
                  `:``}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${d?4:u}) {
                  ${(()=>{let e=``;if(d)u===4?e+=`
        let xValue = ${g.getByOffset(`x_offset`)};
        let wValue = ${f.getByOffset(`w_offset`)};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:u===2?e+=`
          dotProd = dotProd + dot(vec4<${o}>(${g.getByOffset(`x_offset`)}, ${g.getByOffset(`x_offset + 1u`)}), vec4<${o}>(${f.getByOffset(`w_offset`)}, ${f.getByOffset(`w_offset + 1u`)}));
          x_offset += 2u;
          w_offset += 2u;`:u===1&&(e+=`
          dotProd = dotProd + dot(vec4<${o}>(${g.getByOffset(`x_offset`)}, ${g.getByOffset(`x_offset + 1u`)}, ${g.getByOffset(`x_offset + 2u`)}, ${g.getByOffset(`x_offset + 3u`)}), vec4<${o}>(${f.getByOffset(`w_offset`)}, ${f.getByOffset(`w_offset + 1u`)}, ${f.getByOffset(`w_offset + 2u`)}, ${f.getByOffset(`w_offset + 3u`)}));
          x_offset += 4u;
          w_offset += 4u;`);else if(e+=`
                  let xValue = ${a?g.getByOffset(`${g.indicesToOffset(`${g.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${u}`):g.get(`batch`,`inputChannel`,`idyR`,`idyC`)};
        `,u===1)e+=`
          let w_offset = ${f.indicesToOffset(`${f.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${f.getByOffset(`w_offset / ${h}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let t=0;t<u;t++)e+=`
            let wValue${t} = ${f.getByOffset(`${f.indicesToOffset(`${f.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${t}, wOutChannel)`)} / ${h}`)};
            dotProd = dotProd + xValue[${t}] * wValue${t};`;return e})()}
                  inputChannel = inputChannel + ${d?4:u};
                }
                ${(()=>{if(p===0)return``;if(!d)throw Error(`packInputAs4 ${d} is not true.`);let e=``;if(u===1){e+=`dotProd = dotProd`;for(let t=0;t<p;t++)e+=`
            + ${g.getByOffset(`x_offset + ${t}`)} * ${f.getByOffset(`w_offset + ${t}`)}`;e+=`;`}else if(u===2){if(p!==2)throw Error(`Invalid inputChannelsRemainder ${p}.`);e+=`
          let xValue = ${g.getByOffset(`x_offset`)};
          let wValue = ${f.getByOffset(`w_offset`)};
          dotProd = dotProd + dot(xValue, wValue);`}return e})()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${r?` + bias[d1 / ${m}]`:``};
            ${v.setByOffset(`global_idx`,`value`)};
          `;return`
    ${t.registerUniforms(n).declareVariables(..._,v)}
      ${t.mainStart()}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)};
    ${x}}`}}}}),go,_o,vo,yo,bo,xo,So,Co,wo,To=o(()=>{ho(),wa(),Hn(),go=(e,t,n,r,i,a)=>(e-1)*t+n+(r-1)*i+1-a,_o=(e,t,n,r,i)=>{let a=Math.floor(e/2);t===`SAME_UPPER`?(n[r]=a,n[i]=e-a):t===`SAME_LOWER`&&(n[r]=e-a,n[i]=a)},vo=(e,t,n,r,i,a,o,s,c,l)=>{let u=e.length-2,d=l.length===0;c.length<u&&c.push(...Array(u-c.length).fill(0));let f=e[0],p=t[s?3:1]*i;for(let i=0,f=e.length-u-+!!s;i<u;++i,++f){let s=e[f],p=d?s*o[i]:l[i],m=go(s,o[i],a[i],t[f],n[i],p);_o(m,r,a,i,i+u),d&&l.push(o[i]*(s-1)+c[i]+(t[f]-1)*n[i]+1-a[i]-a[i+u])}l.splice(0,0,f),l.splice(s?3:1,0,p)},yo=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((e,t)=>e*t,1)===0){n.length=0;for(let e=2;e<t[1].dims.length;++e)n.push(t[1].dims[e])}let r=e.format===`NHWC`;n.splice(0,0,t[1].dims[0]),n.splice(r?3:1,0,t[1].dims[1]);let i=e.pads.slice(),a=e.outputShape.slice(),o=e.outputPadding.slice(),s=t[0].dims,c=e.dilations.slice();if(c.reduce((e,t)=>e+t,0)===0){let e=t[0].dims.length-2;c=Array(e).fill(1)}let l=e.strides.slice();if(l.reduce((e,t)=>e+t,0)===0){let e=t[0].dims.length-2;l=Array(e).fill(1)}vo(s,n,c,e.autoPad,e.group,i,l,r,o,a);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:i,outputPadding:o,outputShape:a,dilations:c,strides:l}),u},bo=e=>{let t=Ca(e),n=e.format,r=[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][typeof e.autoPad>`u`?0:e.autoPad],i=e.dilations,a=e.group??1,o=e.kernelShape,s=e.pads,c=e.strides,l=e.wIsConst();return{autoPad:r,format:n,dilations:i,group:a,kernelShape:o,outputPadding:e.outputPadding,outputShape:e.outputShape,pads:s,strides:c,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},xo=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw Error(`Conv requires 2 or 3 inputs`);if(e[0].dims.length!==4&&e[0].dims.length!==3)throw Error(`currently only support 2-dimensional conv`);if(e[0].dims.length!==e[1].dims.length)throw Error(`filter does not have same dimension as input`);if(e[0].dims[t.format===`NHWC`?e[0].dims.length-1:1]!==e[1].dims[0])throw Error(`FILTER_IN_CHANNEL should be equal to DATA_CHANNEL`);let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw Error(`invalid bias`);let r=e[0].dims.length-2;if(t.dilations.reduce((e,t)=>e+t,0)>0&&t.dilations.length!==r)throw Error(`dilations should be ${r}D`);if(t.strides.reduce((e,t)=>e+t,0)>0&&t.strides.length!==r)throw Error(`strides should be ${r}D`);if(t.pads.reduce((e,t)=>e+t,0)>0&&t.pads.length!==r*2)throw Error(`pads should be ${r*2}D`);if(t.outputPadding.length!==r&&t.outputPadding.length!==0)throw Error(`output_padding should be ${r}D`);if(t.kernelShape.reduce((e,t)=>e+t,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw Error(`invalid kernel shape`);if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw Error(`invalid output shape`)},So=(e,t,n,r)=>{let i=e.kernelCustomData.wT??e.compute(zn(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=i);let a=[t[0],i];t.length===3&&a.push(t[2]),e.compute(mo(a,n,r),{inputs:a})},Co=(e,t)=>{let n=t.format===`NHWC`,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let i=t.kernelShape;(i.length===0||i[0]===0)&&(i=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let o=t.strides;(o.length===0||o[0]===0)&&(o=[1]);let s=t.pads;s.length===0&&(s=[0,0]),s=[0,s[0],0,s[1]],o=[1].concat(o),a=[1].concat(a),i=[1].concat(i);let c=t.outputPadding;c=[0].concat(c);let l=yo({...t,pads:s,strides:o,dilations:a,kernelShape:i,outputPadding:c},r);So(e,r,l,e=>n?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},wo=(e,t)=>{if(xo(e.inputs,t),e.inputs[0].dims.length===3)Co(e,t);else{let n=yo(t,e.inputs);So(e,e.inputs,n)}}}),Eo,Do,Oo,ko=o(()=>{I(),z(),V(),q(),Eo=(e,t,n,r)=>{let i=R.size(t),a=t.length,o=G(`input`,e,a),s=K(`output`,e,a),c=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),l=R.normalizeAxis(c,a);return{name:`CumSum`,shaderCache:{hint:r.cacheKey,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},{type:12,data:l},...H(t,t)]}),getShaderSource:e=>{let t=` i32(${o.indicesGet(`inputIndices`,`uniforms.axis`)}) `,n=W(`uniforms.input_shape`,`uniforms.axis`,a),i=r.reverse?t+(r.exclusive?` + 1`:``):`0`,c=r.reverse?n:t+(r.exclusive?``:` + 1`);return`
                ${e.registerUniform(`outputSize`,`u32`).registerUniform(`axis`,`u32`).declareVariables(o,s)}
                ${e.mainStart()}
                  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
                  var inputIndices = ${s.offsetToIndices(`global_idx`)};
                  var sum = ${s.type.value}(0);
                  let first : i32 = ${i};
                  let last : i32 = ${c};
                  for (var i : i32 = first; i < last; i++) {
                    ${o.indicesSet(`inputIndices`,`uniforms.axis`,`u32(i)`)};
                    sum = sum + ${o.getByIndices(`inputIndices`)};
                  }
                  ${s.setByOffset(`global_idx`,`sum`)};
                }`}}},Do=(e,t)=>{let n=e.inputs[0].dims,r=e.inputs[0].dataType,i=e.inputs[1];e.compute(Eo(r,n,i,t),{inputs:[0]})},Oo=e=>{let t=e.exclusive===1,n=e.reverse===1;return B({exclusive:t,reverse:n})}}),Ao,jo,Mo,No,Po,Fo=o(()=>{I(),z(),V(),q(),Ao=e=>{if(!e||e.length!==1)throw Error(`DepthToSpace requires 1 input.`);if(e[0].dims.length!==4)throw Error(`DepthToSpace requires 4D input.`)},jo=(e,t,n,r)=>{let i=[];i.push(`fn perm(i: ${r.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let r=0;r<t;++r)i.push(n.indicesSet(`a`,e[r],`i[${r}]`));return i.push(`return a;}`),i.join(`
`)},Mo=(e,t)=>{let n,r,i,a,o,s,c=t.format===`NHWC`,l=t.blocksize,u=t.mode===`DCR`;c?([n,r,i,a]=e.dims,o=u?[n,r,i,l,l,a/l**2]:[n,r,i,a/l**2,l,l],s=u?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,r,i,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],o=u?[n,l,l,a/l**2,r,i]:[n,a/l**2,l,l,r,i],s=u?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let d=e.reshape(o),f=d.dims.length,p=e.dataType,m=G(`a`,p,f),h=K(`output`,p,f);return{name:`DepthToSpace`,shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:[`rank`]},getRunData:e=>{let t=c?[n,r*l,i*l,a/l**2]:[n,a/l**2,r*l,i*l],o=R.size(t),u=d.dims,f=R.sortBasedOnPerm(u,s);return{outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},...H(u,f)]}},getShaderSource:e=>`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(m,h)}

  ${jo(s,f,m,h)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let indices = ${h.offsetToIndices(`global_idx`)};
    let aIndices = perm(indices);

    ${h.setByOffset(`global_idx`,m.getByIndices(`aIndices`))}
  }`}},No=(e,t)=>{Ao(e.inputs),e.compute(Mo(e.inputs[0],t))},Po=e=>B({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Io,Lo,Ro,zo,Bo,Vo,Ho,Uo,Wo,Go,Ko,qo=o(()=>{I(),z(),V(),q(),Io=`[a-zA-Z]|\\.\\.\\.`,Lo=`(`+Io+`)+`,Ro=`^`+Lo+`$`,zo=`(`+Lo+`,)*`+Lo,Bo=`^`+zo+`$`,Vo=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},Ho=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=[],this.outputDims=[];let[n,r]=t.includes(`->`)?t.split(`->`,2):[t,``];if(!n.match(RegExp(Bo)))throw Error(`Invalid LHS term`);if(n.split(`,`).forEach((t,n)=>{let r=e[n].dims.slice();if(!t.match(RegExp(Ro)))throw Error(`Invalid LHS term`);let i=this.processTerm(t,!0,r,n);this.lhs.push(i)}),r===``)r+=[...this.symbolToInfo.entries()].filter(([e,t])=>t.count===1||e===`...`).map(([e])=>e).join(``);else if(!r.match(RegExp(Lo)))throw Error(`Invalid RHS`);r.match(RegExp(Io,`g`))?.forEach(e=>{if(e===`...`)this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let t=this.symbolToInfo.get(e);if(t===void 0)throw Error(`Invalid RHS symbol`);this.outputDims.push(t.dimValue)}}),this.rhs=this.processTerm(r,!1,this.outputDims)}addSymbol(e,t,n){let r=this.symbolToInfo.get(e);if(r!==void 0){if(r.dimValue!==t&&r.count!==1)throw Error(`Dimension mismatch`);r.count++,r.inputIndices.push(n)}else r={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,r)}processTerm(e,t,n,r=-1){let i=n.length,a=!1,o=[],s=0;if(!e.match(RegExp(Ro))&&!t&&e!==``)throw Error(`Invalid LHS term`);let c=e.match(RegExp(Io,`g`)),l=new Vo(r);return c?.forEach((e,u)=>{if(e===`...`){if(a)throw Error(`Only one ellipsis is allowed per input term`);a=!0;let e=i-c.length+1;if(e<0)throw Error(`Ellipsis out of bounds`);if(o=n.slice(s,s+e),this.hasEllipsis){if(this.ellipsisDims.length!==o.length||this.ellipsisDims.toString()!==o.toString())throw Error(`Ellipsis dimensions mismatch`)}else if(t)this.hasEllipsis=!0,this.ellipsisDims=o;else throw Error(`Ellipsis must be specified in the LHS`);for(let e=0;e<o.length;e++){let t=String.fromCharCode(48+e);l.addSymbol(t,u+e),this.addSymbol(t,n[s++],r)}}else l.addSymbol(e,u+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(e,n[s++],r)}),l}},Uo=e=>e+`_max`,Wo=(e,t,n,r)=>{let i=e.map(e=>e.length).map((e,n)=>G(`input${n}`,t,e)),a=R.size(r),o=K(`output`,t,r.length),s=[...n.symbolToInfo.keys()].filter(e=>!n.rhs.symbolToIndices.has(e));return{name:`Einsum`,shaderCache:{hint:n.equation,inputDependencies:e.map(()=>`rank`)},getRunData:()=>{let i=s.filter(e=>n.symbolToInfo.has(e)).map(e=>({type:12,data:n.symbolToInfo.get(e)?.dimValue||0}));i.push({type:12,data:a});let o=e.map((e,t)=>[...H(e)]).reduce((e,t)=>e.concat(t),i);return o.push(...H(r)),{outputs:[{dims:r,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:o}},getShaderSource:e=>{let t=[],r=[],a=[],c=[],l=[],u=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((e,s)=>{if(n.rhs.symbolToIndices.has(s)){let r=n.rhs.symbolToIndices.get(s)?.[0];r!==void 0&&n.lhs.forEach((n,a)=>{if(e.inputIndices.includes(a)){let e=n.symbolToIndices.get(s);if(e===void 0)throw Error(`Invalid symbol error`);e.forEach(e=>{t.push(`${i[a].indicesSet(`input${a}Indices`,e,o.indicesGet(`outputIndices`,r))}`)})}})}else n.lhs.forEach((t,n)=>{if(e.inputIndices.includes(n)){let e=t.symbolToIndices.get(s);if(e===void 0)throw Error(`Invalid symbol error`);e.forEach(e=>{r.push(`${i[n].indicesSet(`input${n}Indices`,e,`${s}`)}`)}),l.push(`prod *= ${i[n].getByIndices(`input${n}Indices`)};`)}}),a.push(`for(var ${s}: u32 = 0; ${s} < uniforms.${Uo(s)}; ${s}++) {`),c.push(`}`)});let d=u?[...t,`let sum = ${i.map((e,t)=>e.getByIndices(`input${t}Indices`)).join(` * `)};`]:[...t,`var sum = 0.0;`,...a,...r,`var prod = 1.0;`,...l,`sum += prod;`,...c];return`
            ${e.registerUniforms(s.map(e=>({name:`${Uo(e)}`,type:`u32`}))).registerUniform(`outputSize`,`u32`).declareVariables(...i,o)}

            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
            var outputIndices = ${o.offsetToIndices(`global_idx`)};
            ${i.map((e,t)=>`var input${t}Indices: ${i[t].type.indices};`).join(`
`)}
            ${d.join(`
`)};
            ${o.setByOffset(`global_idx`,`sum`)};
          }`}}},Go=(e,t)=>{let n=new Ho(e.inputs,t.equation),r=n.outputDims,i=e.inputs.map((e,t)=>e.dims);e.compute(Wo(i,e.inputs[0].dataType,n,r))},Ko=e=>{let t=e.equation.replace(/\s+/g,``);return B({equation:t})}}),Jo,Yo,Xo,Zo,Qo,$o=o(()=>{I(),z(),q(),Jo=e=>{if(!e||e.length!==2)throw Error(`Expand requires 2 input.`);let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),r=n.length<t.length?0:n.length-t.length,i=t.length<n.length?0:t.length-n.length;for(;r<n.length&&i<t.length;++r,++i)if(n[r]!==t[i]&&n[r]!==1&&t[i]!==1)throw Error(`Expand requires shape to be broadcastable to input`)},Yo=(e,t)=>{let n=e.length-t.length,r=[];for(let t=0;t<n;++t)r.push(e[t]);for(let i=0;i<t.length;++i)r.push(t[i]===1?e[i+n]:t[i]);return r},Xo=(e,t)=>e.length>t.length?Yo(e,t):Yo(t,e),Zo=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),r=Xo(t,n),i=e[0].dataType,a=i===9||R.size(t)===1,o=i===9||t.length>0&&t[t.length-1]%4==0?4:1,s=a||r.length>0&&r[r.length-1]%4==0?4:1,c=Math.ceil(R.size(r)/s),l=e=>{let n=G(`input`,i,t.length,o),a=K(`output`,i,r.length,s),c;if(i===9){let e=(e,t,r=``)=>`
          let outputIndices${t} = ${a.offsetToIndices(`outputOffset + ${t}u`)};
          let offset${t} = ${n.broadcastedIndicesToOffset(`outputIndices${t}`,a)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${r}(${n.getByOffset(`index${t}`)}[component${t}]);
        `;c=`
        let outputOffset = global_idx * ${s};
        var data = vec4<u32>(0);
        ${e(`data`,0,`u32`)}
        ${e(`data`,1,`u32`)}
        ${e(`data`,2,`u32`)}
        ${e(`data`,3,`u32`)}
        ${a.setByOffset(`global_idx`,`data`)}
      }`}else c=`
        let outputIndices = ${a.offsetToIndices(`global_idx * ${s}`)};
        let inputOffset = ${n.broadcastedIndicesToOffset(`outputIndices`,a)};
        let data = ${a.type.value}(${n.getByOffset(`inputOffset / ${o}`)});
        ${a.setByOffset(`global_idx`,`data`)}
      }`;return`
    ${e.registerUniform(`vec_size`,`u32`).declareVariables(n,a)}
    ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
    ${c}`},u=[{type:12,data:c},...H(t,r)];return{name:`Expand`,shaderCache:{hint:`${r.length};${o}${s}`,inputDependencies:[`rank`]},getShaderSource:l,getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:u})}},Qo=e=>{Jo(e.inputs),e.compute(Zo(e.inputs),{inputs:[0]})}}),es,ts,ns=o(()=>{I(),z(),q(),Ji(),es=e=>{let t=e[0].dataType,n=R.size(e[0].dims),r=R.size(e[1].dims),i=r%4==0;return{name:`FastGeluWithBias`,shaderCache:{hint:`${i}`,inputDependencies:[`type`,`type`]},getShaderSource:e=>{let n=G(`x`,t,[1],4),r=G(`bias`,t,[1],4),a=K(`y`,t,[1],4),o=[{name:`output_vec_size`,type:`u32`},{name:`bias_size`,type:`u32`}],s=e=>`
      let bias${e}_offset: u32 = (global_idx * 4 + ${e}) % uniforms.bias_size;
      let bias${e} = ${r.getByOffset(`bias${e}_offset / 4`)}[bias${e}_offset % 4];`,c=i?`
      let bias = ${r.getByOffset(`global_idx % (uniforms.bias_size / 4)`)};`:`${s(0)}${s(1)}${s(2)}${s(3)}
      let bias = ${n.type.value}(bias0, bias1, bias2, bias3);`;return`${e.registerUniforms(o).declareVariables(n,r,a)}

    ${Bi(wn(t))}

    ${e.mainStart(xn)}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_vec_size`)}

      let x = ${n.getByOffset(`global_idx`)};
      ${c}
      let x_in = x + bias;
      ${a.setByOffset(`global_idx`,Vi(`x_in`))}
    }`},getRunData:e=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:r}],dispatchGroup:{x:Math.ceil(n/xn/4)}})}},ts=e=>{e.inputs.length<2||R.size(e.inputs[1].dims)===0?Hi(e):e.compute(es(e.inputs))}}),rs,is,as,os,ss=o(()=>{I(),z(),V(),q(),rs=e=>{if(!e||e.length!==2)throw Error(`Gather requires 2 inputs.`)},is=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n.length,a=R.normalizeAxis(t.axis,i),o=n.slice(0);o.splice(a,1,...r);let s=n[a],c=e[0].dataType===9?4:1,l=Math.ceil(R.size(o)/c),u=[{type:12,data:l},{type:6,data:s},{type:12,data:a},...H(e[0].dims,e[1].dims,o)];return{name:`Gather`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:u}),getShaderSource:t=>{let n=G(`data`,e[0].dataType,e[0].dims.length,c),s=G(`inputIndices`,e[1].dataType,e[1].dims.length),l=K(`output`,e[0].dataType,o.length,c),u=e=>{let t=r.length,c=`var indicesIndices${e}  = ${s.type.indices}(0);`;for(let n=0;n<t;n++)c+=`${t>1?`indicesIndices${e}[${n}]`:`indicesIndices${e}`} = ${o.length>1?`outputIndices${e}[uniforms.axis + ${n}]`:`outputIndices${e}`};`;c+=`
          var idx${e} = ${s.getByIndices(`indicesIndices${e}`)};
          if (idx${e} < 0) {
            idx${e} = idx${e} + uniforms.axisDimLimit;
          }
          var dataIndices${e} : ${n.type.indices};
        `;for(let n=0,r=0;n<i;n++)n===a?(c+=`${i>1?`dataIndices${e}[${n}]`:`dataIndices${e}`} = u32(idx${e});`,r+=t):(c+=`${i>1?`dataIndices${e}[${n}]`:`dataIndices${e}`} = ${o.length>1?`outputIndices${e}[${r}]`:`outputIndices${e}`};`,r++);return c},d;if(e[0].dataType===9){let e=(e,t,r=``)=>`
          let outputIndices${t} = ${l.offsetToIndices(`outputOffset + ${t}u`)};
          ${u(t)};
          let offset${t} = ${n.indicesToOffset(`dataIndices${t}`)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${r}(${n.getByOffset(`index${t}`)}[component${t}]);
        `;d=`
        let outputOffset = global_idx * ${c};
        var value = vec4<u32>(0);
        ${e(`value`,0,`u32`)}
        ${e(`value`,1,`u32`)}
        ${e(`value`,2,`u32`)}
        ${e(`value`,3,`u32`)}
        ${l.setByOffset(`global_idx`,`value`)}
      `}else d=`
      let outputIndices = ${l.offsetToIndices(`global_idx`)};
      ${u(``)};
      let value = ${n.getByIndices(`dataIndices`)};
      ${l.setByOffset(`global_idx`,`value`)};
      `;return`
      ${t.registerUniform(`outputSize`,`u32`).registerUniform(`axisDimLimit`,`i32`).registerUniform(`axis`,`u32`).declareVariables(n,s,l)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
        ${d}
      }`}}},as=e=>B({axis:e.axis}),os=(e,t)=>{let n=e.inputs;rs(n),e.compute(is(e.inputs,t))}}),cs,ls,us,ds=o(()=>{I(),z(),q(),cs=(e,t,n,r,i,a,o,s,c)=>{let l=[{type:12,data:a},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:o},{type:12,data:s},{type:12,data:c}],u=[a];return l.push(...H(t.dims,u)),e.compute({name:`computeSliceOffsets`,shaderCache:{hint:`${i.length}_${n.length}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:u,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:e=>{let r=[G(`indices_data`,t.dataType,t.dims.length),K(`input_slice_offsets_data`,12,1,1)],a=[{name:`output_size`,type:`u32`},{name:`batch_dims`,type:`u32`},{name:`input_dims`,type:`u32`,length:i.length},{name:`sizes_from_slice_dims_data`,type:`u32`,length:n.length},{name:`num_slices_per_batch`,type:`u32`},{name:`input_batch_stride`,type:`u32`},{name:`num_slice_dims`,type:`u32`}];return`
  ${e.registerUniforms(a).declareVariables(...r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${i.length===1?`index += i32(uniforms.input_dims);`:`index += i32(uniforms.input_dims[input_dim_idx]);`}
      }
      ${n.length===1?`relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);`:`relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);`}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`}},{inputs:[t],outputs:[-1]})[0]},ls=(e,t)=>{let n=e.inputs,r=n[0].dims,i=n[0].dataType,a=n[1].dims,o=a[a.length-1],s=R.sizeToDimension(a,a.length-1),c=R.sizeFromDimension(r,t.batchDims+o),l=R.sizeToDimension(r,t.batchDims),u=R.sizeFromDimension(r,t.batchDims),d=s/l,f=Array(o),p=c;for(let e=0;e<o;++e)f[o-1-e]=p,p*=r[t.batchDims+o-1-e];let m=cs(e,n[1],f,t.batchDims,r,s,d,u,o),h=t.batchDims+o;if(h>r.length)throw Error(`last dimension of indices must not be larger than rank of input tensor`);let g=a.slice(0,-1).concat(r.slice(h)),_=R.size(g),v=[{type:12,data:_},{type:12,data:c},...H(n[0].dims,m.dims,g)];e.compute({name:`GatherND`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:g,dataType:i}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:v}),getShaderSource:e=>{let t=G(`data`,n[0].dataType,n[0].dims.length),r=G(`slice_offsets`,12,m.dims.length),i=K(`output`,n[0].dataType,g.length);return`
          ${e.registerUniform(`output_size`,`u32`).registerUniform(`slice_size`,`u32`).declareVariables(t,r,i)}
            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`}},{inputs:[n[0],m]})},us=e=>({batchDims:e.batch_dims,cacheKey:``})}),fs,ps,ms,hs,gs=o(()=>{I(),z(),V(),q(),fs=(e,t)=>{if(e.length<3||e.length>4)throw Error(`GatherBlockQuantized requires 3 or 4 inputs.`);let n=R.normalizeAxis(t.quantizeAxis,e[0].dims.length),r=t.blockSize,i=e[0],a=e[2],o=e.length===4?e[3]:void 0;if(a.dims.length!==i.dims.length||!i.dims.map((e,t)=>t===n?Math.ceil(e/r)===a.dims[t]:e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error(`Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.`);if(o){if(o.dataType!==i.dataType)throw Error(`Zero point must have the same data type as the input tensor.`);if(o.dims.length!==a.dims.length||!o.dims.map((e,t)=>e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error(`Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.`)}},ps=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n.length,a=R.normalizeAxis(t.gatherAxis,i),o=R.normalizeAxis(t.quantizeAxis,i),s=n.slice(0);s.splice(a,1,...r);let c=R.size(s),l=e[2].dataType,u=e[0].dataType===22,d=[{type:12,data:c},{type:12,data:o},{type:12,data:a},{type:12,data:t.blockSize},...H(...e.map((e,t)=>e.dims),s)];return{name:`GatherBlockQuantized`,shaderCache:{hint:`${t.cacheKey};${e.filter((e,t)=>t!==1).map(e=>e.dims.join(`_`)).join(`;`)}`,inputDependencies:Array.from({length:e.length},(e,t)=>`rank`)},getRunData:()=>({outputs:[{dims:s,dataType:l}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:d}),getShaderSource:t=>{let i=G(`data`,e[0].dataType,e[0].dims.length),o=G(`inputIndices`,e[1].dataType,e[1].dims.length),c=G(`scales`,e[2].dataType,e[2].dims.length),d=e.length>3?G(`zeroPoint`,e[3].dataType,e[3].dims.length):void 0,f=K(`output`,l,s.length),p=[i,o,c];return d&&p.push(d),`
        ${t.registerUniforms([{name:`output_size`,type:`u32`},{name:`quantize_axis`,type:`u32`},{name:`gather_axis`,type:`u32`},{name:`block_size`,type:`u32`}]).declareVariables(...p,f)}
        ${t.mainStart()}
        let output_indices = ${f.offsetToIndices(`global_idx`)};
        var indices_indices = ${o.type.indices}(0);
        ${r.length>1?`
          for (var i: u32 = 0; i < ${r.length}; i++) {
            let index = ${f.indicesGet(`output_indices`,`uniforms.gather_axis + i`)};
            ${o.indicesSet(`indices_indices`,`i`,`index`)};
          }`:`indices_indices = ${f.indicesGet(`output_indices`,`uniforms.gather_axis`)};`};
        var data_indices = ${i.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${f.indicesGet(`output_indices`,`i`)};
          ${i.indicesSet(`data_indices`,`i`,`index`)};
        }
        var index_from_indices = ${o.getByIndices(`indices_indices`)};
        if (index_from_indices < 0) {
          index_from_indices += ${n[a]};
        }
        ${i.indicesSet(`data_indices`,`uniforms.gather_axis`,`u32(index_from_indices)`)};
        for (var i = uniforms.gather_axis + 1; i < ${s.length}; i++) {
          let index = ${f.indicesGet(`output_indices`,`i + ${r.length} - 1`)};
          ${i.indicesSet(`data_indices`,`i`,`index`)};
        }
        let data_offset = ${i.indicesToOffset(`data_indices`)};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${i.getByOffset(`data_offset / 8`)};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${u?`unpack4xI8`:`unpack4xU8`}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${c.indicesGet(`data_indices`,`uniforms.quantize_axis`)} / uniforms.block_size;
        ${c.indicesSet(`scale_indices`,`uniforms.quantize_axis`,`quantize_axis_index`)};
        var scale = ${c.getByIndices(`scale_indices`)};
        ${d?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${d.indicesToOffset(`zero_point_indices`)};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${d.getByOffset(`zero_point_offset / 8`)};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${u?`unpack4xI8`:`unpack4xU8`}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:`var zero_point = 0`};
        let dequantized_data = ${wn(l)}(quantized_data - zero_point) * scale;
        ${f.setByOffset(`global_idx`,`dequantized_data`)};
    }`}}},ms=(e,t)=>{let n=e.inputs;fs(n,t),e.compute(ps(e.inputs,t))},hs=e=>B({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),_s,vs,ys,bs,xs=o(()=>{I(),z(),V(),q(),_s=e=>{if(!e||e.length!==2)throw Error(`GatherElements requires 2 inputs.`);if(e[0].dims.length<1)throw Error(`GatherElements requires that the data input be rank >= 1.`);if(e[0].dims.length!==e[1].dims.length)throw Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},vs=(e,t)=>{let n=e[0].dims,r=e[0].dataType,i=n.length,a=e[1].dims,o=e[1].dataType,s=R.normalizeAxis(t.axis,i),c=n[s],l=a.slice(0),u=R.size(l),d=G(`input`,r,i),f=G(`indicesInput`,o,a.length),p=K(`output`,r,l.length),m=[{type:12,data:u},{type:6,data:c},{type:12,data:s}];return m.push(...H(n,a,l)),{name:`GatherElements`,shaderCache:{inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:e=>`
      ${e.registerUniform(`outputSize`,`u32`).registerUniform(`axisDimLimit`,`i32`).registerUniform(`axis`,`u32`).declareVariables(d,f,p)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

      let outputIndices = ${p.offsetToIndices(`global_idx`)};

      var idx = ${f.getByOffset(`global_idx`)};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${d.type.indices}(outputIndices);
      ${d.indicesSet(`inputIndices`,`uniforms.axis`,`u32(idx)`)};
      let value = ${d.getByIndices(`inputIndices`)};

      ${p.setByOffset(`global_idx`,`value`)};
  }`}},ys=e=>B({axis:e.axis}),bs=(e,t)=>{let n=e.inputs;_s(n),e.compute(vs(e.inputs,t))}}),Ss,Cs,ws,Ts,Es=o(()=>{I(),z(),q(),Ss=e=>{if(!e)throw Error(`Input is missing`);if(e.length<2||e.length>3)throw Error(`Invaid input number.`);if(e.length===3&&e[2].dims.length>2)throw Error(`Invalid input shape of C`);if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw Error(`Input types are mismatched`)},Cs=(e,t)=>{let n=e[0].dims.slice(),r=e[1].dims.slice(),[i,a,o]=Vt.getShapeOfGemmResult(n,t.transA,r,t.transB,e.length===3?e[2].dims:void 0),s=[i,a];if(!s)throw Error(`Can't use gemm on the given tensors`);let c=Math.ceil(a/16),l=Math.ceil(i/16);R.size(s);let u=[{type:12,data:c},{type:12,data:i},{type:12,data:a},{type:12,data:o},{type:1,data:t.alpha},{type:1,data:t.beta}],d=[`type`,`type`];return e.length===3&&(u.push(...H(e[2].dims)),d.push(`rank`)),u.push(...H(s)),{name:`GemmShared`,shaderCache:{hint:`${t.cacheKey}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:c*l},programUniforms:u}),getShaderSource:n=>{let r=G(`a`,e[0].dataType,e[0].dims),i=G(`b`,e[1].dataType,e[1].dims),a=null,o=[r,i];e.length===3&&(a=G(`c`,e[2].dataType,e[2].dims.length),o.push(a));let c=K(`output`,e[0].dataType,s.length);o.push(c);let l=[{name:`num_tile_n`,type:`u32`},{name:`M`,type:`u32`},{name:`N`,type:`u32`},{name:`K`,type:`u32`},{name:`alpha`,type:`f32`},{name:`beta`,type:`f32`}],u=``,d=``;t.transA&&t.transB?(d=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[k][local_id.y] * tile_b[local_id.x][k];`):t.transA&&!t.transB?(d=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[k][local_id.y] * tile_b[k][local_id.x];`):!t.transA&&t.transB?(d=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[local_id.y][k] * tile_b[local_id.x][k];`):!t.transA&&!t.transB&&(d=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[local_id.y][k] * tile_b[k][local_id.x];`);let f=t.alpha===1?``:`value *= uniforms.alpha;`;return`
  ${n.registerUniforms(l).declareVariables(...o)}
  var<workgroup> tile_a: array<array<${r.type.storage}, 16>, 16>;
  var<workgroup> tile_b: array<array<${i.type.storage}, 16>, 16>;
  ${n.mainStart([16,16,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * 16;
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * 16;
    let num_tiles = (uniforms.K - 1) / 16 + 1;
    var k_start = 0u;
    var value = ${c.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${d}
      k_start = k_start + 16;
      workgroupBarrier();

      for (var k: u32 = 0u; k < 16; k++) {
        ${u}
      }
      workgroupBarrier();
    }

    ${f}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${a==null?``:`let cOffset = ${a.broadcastedIndicesToOffset(`vec2(m, n)`,c)}; value += ${c.type.value}(uniforms.beta) * ${a.getByOffset(`cOffset`)};`}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`}}},ws=e=>({transA:e.transA,transB:e.transB,alpha:e.alpha,beta:e.beta,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}),Ts=(e,t)=>{Ss(e.inputs),e.compute(Cs(e.inputs,t))}}),Ds,Os,ks,As,js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs,Bs,Vs=o(()=>{I(),z(),V(),q(),[Ds,Os,ks,As]=[0,1,2,3],js=e=>{if(e[0].dims.length!==4)throw Error(`only 4-D tensor is supported.`);if(e[0].dims.length!==e[1].dims.length)throw Error(`input dimensions must be equal to grid dimensions`);if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw Error(`grid batch size must match input batch size`)},Ms=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Ns=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Ps=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Fs=e=>`
  ${e.paddingMode===`reflection`?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:``}
`,Is=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Ds}] = batch;
     indices[${Os}] = channel;`+(()=>{switch(n.paddingMode){case`zeros`:return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${ks}] = u32(r);
            indices[${As}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case`border`:return`
          indices[${ks}] = u32(clamp(r, 0, H - 1));
          indices[${As}] = u32(clamp(c, 0, W - 1));
        `;case`reflection`:return`
          indices[${ks}] = gs_reflect(r, border[1], border[3]);
          indices[${As}] = gs_reflect(c, border[0], border[2]);
        `;default:throw Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices(`indices`)};
  }
`,Ls=(e,t,n)=>(()=>{switch(n.mode){case`nearest`:return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Ds}], indices[${Os}], border);
        `;case`bilinear`:return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Ds}], indices[${Os}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Ds}], indices[${Os}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Ds}], indices[${Os}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Ds}], indices[${Os}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case`bicubic`:return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Ds}], indices[${Os}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset(`global_idx`,`result`)}`,Rs=(e,t)=>{let n=G(`x`,e[0].dataType,e[0].dims.length),r=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],i=G(`grid`,e[1].dataType,r.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format===`NHWC`&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Ds,Os,ks,As]=[0,3,1,2]);let o=K(`output`,e[0].dataType,a.length),s=n.type.value,c=[{type:12,data:R.size(a)},...H(e[0].dims,r,a)];return{name:`GridSample`,shaderCache:{hint:`${t.cacheKey}`,inputDependencies:[`type`,`type`]},getRunData:e=>{let t=R.size(a);return{outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:c}},getShaderSource:e=>`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(n,i,o)}
  ${Ms}
  ${Ns(s)}
  ${Ps(t)}
  ${Fs(t)}
  ${Is(n,s,t)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let H_in = i32(uniforms.x_shape[${ks}]);
      let W_in = i32(uniforms.x_shape[${As}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${o.offsetToIndices(`global_idx`)};
      var grid_indices = vec3<u32>(indices[${Ds}], indices[${ks}], indices[${As}]);
      let nxy = ${i.getByIndices(`grid_indices`)};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Ls(o,s,t)}
  }`}},zs=(e,t)=>{js(e.inputs),e.compute(Rs(e.inputs,t))},Bs=e=>B({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Hs,Us,Ws,Gs,Ks,qs,Js,Ys=o(()=>{I(),z(),V(),ln(),Jr(),q(),Hn(),Hs=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Us=(e,t)=>{let n=e[0],r=Hs(e,1),i=Hs(e,2),a=Hs(e,3),o=Hs(e,4),s=Hs(e,5),c=Hs(e,6),l=Hs(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input query is expected to have 3 or 5 dimensions`);let u=n.dims[0],d=n.dims[1],f=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],p=d,m=0,h=0,g=Math.floor(f/t.numHeads);if(c&&l&&R.size(c.dims)&&R.size(l.dims)){if(c.dims.length!==4)throw Error(`Input "past_key" is expected to have 4 dimensions`);if(c.dims[0]!==u||c.dims[1]!==t.numHeads||c.dims[3]!==g)throw Error(`Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)`);if(l.dims[0]!==u||l.dims[1]!==t.numHeads||l.dims[3]!==g)throw Error(`Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)`);if(c.dims[2]!==l.dims[2])throw Error(`Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)`);if(l.dims.length!==4)throw Error(`Input "past_value" is expected to have 4 dimensions`);m=c.dims[2],h=c.dims[2]}else if(c&&R.size(c.dims)||l&&R.size(l.dims))throw Error(`Input "past_key" and "past_value" shall be both present or both absent`);let _;if(r&&R.size(r.dims)>0){if(n.dims.length!==3)throw Error(`Input "query" is expected to have 3 dimensions when key is given`);if(r.dims.length<3||r.dims.length>5)throw Error(`Input "key" is expected to have 3, 4, or 5 dimensions`);if(n.dims[0]!==r.dims[0])throw Error(`Input "query" and "key" shall have same dim 0 (batch size)`);if(r.dims.length===3){if(r.dims[2]!==n.dims[2])throw Error(`Input "query" and "key" shall have same dim 2 (hidden_size)`);_=2,p=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==g)throw Error(`Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv`);if(i)throw Error(`Expect "value" be none when "key" has packed kv format.`);_=5,p=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==g)throw Error(`Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key`);_=0,p=r.dims[2]}}else{if(n.dims.length!==5)throw Error(`Input "query" is expected to have 5 dimensions when key is empty`);if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw Error(`Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv`);_=3}if(a&&R.size(a.dims)>0){if(a.dims.length!==1)throw Error(`Input "bias" is expected to have 1 dimension`);if(r&&r.dims.length===5&&r.dims[3]===2)throw Error(`bias is not allowed for packed kv.`)}let v=m+p,y=0;if(o&&R.size(o.dims)>0){y=8;let e=o.dims;throw e.length===1?e[0]===u?y=1:e[0]===3*u+2&&(y=3):e.length===2&&e[0]===u&&e[1]===v&&(y=5),Error(y===8?`Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)`:`Mask not supported`)}let b=!1,x=f;if(i&&R.size(i.dims)>0){if(i.dims.length!==3&&i.dims.length!==4)throw Error(`Input "value" is expected to have 3 or 4 dimensions`);if(n.dims[0]!==i.dims[0])throw Error(`Input "query" and "value" shall have same dim 0 (batch_size)`);if(i.dims.length===3){if(p!==i.dims[1])throw Error(`Input "key" and "value" shall have the same dim 1 (kv_sequence_length)`);x=i.dims[2]}else{if(p!==i.dims[2])throw Error(`Input "key" and "value" shall have the same dim 2 (kv_sequence_length)`);x=i.dims[1]*i.dims[3],b=!0}}if(o&&R.size(o.dims)>0)throw Error(`Key padding mask is not supported`);if(s&&R.size(s.dims)>0){if(s.dims.length!==4)throw Error(`Input "attention_bias" is expected to have 4 dimensions`);if(s.dims[0]!==u||s.dims[1]!==t.numHeads||s.dims[2]!==d||s.dims[3]!==v)throw Error(`Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)`)}return{batchSize:u,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:p,totalSequenceLength:v,maxSequenceLength:h,inputHiddenSize:0,hiddenSize:f,vHiddenSize:x,headSize:g,vHeadSize:Math.floor(x/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:y,scale:t.scale,broadcastResPosBias:!1,passPastInKv:b,qkvFormat:_}},Ws=e=>B({...e}),Gs=B({perm:[0,2,1,3]}),Ks=(e,t,n,r,i,a,o)=>{let s=[r,i,a],c=R.size(s),l=[{type:12,data:c},{type:12,data:o},{type:12,data:a}];return e.compute({name:`MultiHeadAttentionAddBias`,shaderCache:{inputDependencies:[`type`,`type`]},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l}),getShaderSource:e=>{let r=K(`qkv_with_bias`,t.dataType,s),i=G(`qkv`,t.dataType,s),a=G(`bias`,n.dataType,s);return`
  ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`bias_offset`,type:`u32`},{name:`hidden_size`,type:`u32`}]).declareVariables(i,a,r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`}},{inputs:[t,n],outputs:[-1]})[0]},qs=(e,t,n,r,i,a,o,s)=>{let c=a;if(o&&R.size(o.dims)>0){if(r===1)throw Error(`AddBiasReshape is not implemented. Please export your model with packed QKV or KV`);return c=Ks(e,a,o,t,r,n*i,s),c=c.reshape([t,r,n,i]),n===1||r===1?c:e.compute(zn(c,Gs.perm),{inputs:[c],outputs:[-1]})[0]}else return a.dims.length===3&&(c=a.reshape([t,r,n,i])),n===1||r===1?c:e.compute(zn(c,Gs.perm),{inputs:[c],outputs:[-1]})[0]},Js=(e,t)=>{let n=Us(e.inputs,t),r=e.inputs[0],i=Hs(e.inputs,1),a=Hs(e.inputs,2),o=Hs(e.inputs,3),s=Hs(e.inputs,4),c=Hs(e.inputs,5),l=Hs(e.inputs,6),u=Hs(e.inputs,7);if(r.dims.length===5)throw Error(`Packed QKV is not implemented`);if(i?.dims.length===5)throw Error(`Packed KV is not implemented`);let d=i&&a&&i.dims.length===4&&a.dims.length===4,f=qs(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,r,o,0);if(d)return Gr(e,f,i,a,s,void 0,l,u,c,n);if(!i||!a)throw Error(`key and value must be provided`);let p=qs(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,i,o,n.hiddenSize),m=qs(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,a,o,2*n.hiddenSize);Gr(e,f,p,m,s,void 0,l,u,c,n)}}),Xs,Zs,Qs,$s,ec,tc,nc,rc=o(()=>{I(),z(),V(),q(),Xs=e=>{if(!e||e.length<1)throw Error(`too few inputs`)},Zs=(e,t)=>{let n=[],r=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(e=>n.push(Number(e))),r=n.length),B({numOutputs:r,axis:t.axis,splitSizes:n})},Qs=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${W(`uniforms.size_in_split_axis`,`i`,e)}) {
        return i;
    }
    }
    return ${e}u;
}`,$s=e=>{let t=e.length,n=[];for(let r=0;r<t;++r){let i=e[r].setByIndices(`indices`,`input[global_idx]`);t===1?n.push(i):r===0?n.push(`if (output_number == ${r}u) { ${i} }`):r===t-1?n.push(`else { ${i} }`):n.push(`else if (output_number == ${r}) { ${i} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},ec=(e,t)=>{let n=e[0].dims,r=R.size(n),i=e[0].dataType,a=R.normalizeAxis(t.axis,n.length),o=Array(t.numOutputs),s=G(`input`,i,n.length),c=Array(t.numOutputs),l=[],u=[],d=0,f=[{type:12,data:r}];for(let r=0;r<t.numOutputs;r++){d+=t.splitSizes[r],c[r]=d;let s=n.slice();s[a]=t.splitSizes[r],u.push(s),o[r]=K(`output${r}`,i,s.length),l.push({dims:u[r],dataType:e[0].dataType})}return f.push({type:12,data:c},...H(n,...u)),{name:`Split`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`]},getShaderSource:e=>`
  ${e.registerUniform(`input_size`,`u32`).registerUniform(`size_in_split_axis`,`u32`,c.length).declareVariables(s,...o)}
  ${Qs(c.length)}
  ${$s(o)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.input_size`)}

    var indices = ${s.offsetToIndices(`global_idx`)};
    var index = ${s.indicesGet(`indices`,a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${W(`uniforms.size_in_split_axis`,`output_number - 1u`,c.length)};
      ${s.indicesSet(`indices`,a,`index`)};
    }
    writeBufferData(output_number, indices, global_idx);
  }`,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(r/64)},programUniforms:f})}},tc=(e,t)=>{Xs(e.inputs);let n=e.inputs.length===1?t:Zs(e.inputs,t);e.compute(ec(e.inputs,n),{inputs:[0]})},nc=e=>{let t=e.axis,n=e.splitSizes,r=e.numOutputs<0?n.length:e.numOutputs;if(r!==n.length)throw Error(`numOutputs and splitSizes length must be equal`);return B({axis:t,numOutputs:r,splitSizes:n})}}),ic,ac,oc,sc=o(()=>{I(),z(),V(),q(),ic=(e,t)=>{let[n,r,i,a]=e,{numHeads:o,rotaryEmbeddingDim:s}=t;if(n.dims.length!==3&&n.dims.length!==4)throw Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!R.areEqual(r.dims,[])&&!R.areEqual(r.dims,[1])&&r.dims.length!==2)throw Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${r.dims.length}`);if(i.dims.length!==2)throw Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!R.areEqual(i.dims,a.dims))throw Error(`Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape`);if(s>0&&o===0)throw Error(`num_heads must be provided if rotary_embedding_dim is specified`);let c=n.dims[0],l=n.dims[n.dims.length-2],u=i.dims[0],d=R.sizeFromDimension(n.dims,1)/l,f=s===0?i.dims[1]*2:d/o;if(s>f)throw Error(`rotary_embedding_dim must be less than or equal to head_size`);if(r.dims.length===2){if(c!==r.dims[0])throw Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${r.dims[0]}`);if(l!==r.dims[1])throw Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${r.dims[1]}`)}if(l>u)throw Error(`Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported`);if(f/2!==i.dims[1]&&s/2!==i.dims[1])throw Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${i.dims[1]}`)},ac=(e,t)=>{let{interleaved:n,numHeads:r,rotaryEmbeddingDim:i,scale:a}=t,o=e[0].dims[0],s=R.sizeFromDimension(e[0].dims,1),c=e[0].dims[e[0].dims.length-2],l=s/c,u=e[2].dims[1],d=i===0?u*2:l/r,f=[o,c,l/d,d-u],p=R.computeStrides(f),m=[{type:1,data:a},{type:12,data:f},{type:12,data:p},...e[0].dims.length===3?Array({type:12,data:[s,l,d,1]}):[],...e[0].dims.length===4?Array({type:12,data:[s,d,c*d,1]}):[],...H(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)];return{name:`RotaryEmbedding`,shaderCache:{hint:B({interleaved:n}).cacheKey,inputDependencies:[`rank`,`rank`,`rank`,`rank`]},getShaderSource:t=>{let r=G(`input`,e[0].dataType,e[0].dims.length),i=G(`position_ids`,e[1].dataType,e[1].dims.length),a=G(`cos_cache`,e[2].dataType,e[2].dims.length),o=G(`sin_cache`,e[3].dataType,e[3].dims.length),s=K(`output`,e[0].dataType,e[0].dims.length);return t.registerUniforms([{name:`scale`,type:`f32`},{name:`global_shape`,type:`u32`,length:f.length},{name:`global_strides`,type:`u32`,length:p.length},{name:`input_output_strides`,type:`u32`,length:p.length}]),`
        ${t.declareVariables(r,i,a,o,s)}

        ${t.mainStart(xn)}
          let half_rotary_emb_dim = uniforms.${a.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${t.guardAgainstOutOfBoundsWorkgroupSizes(`size`)}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${i.broadcastedIndicesToOffset(`bsnh.xy`,K(``,i.type.tensor,2))};
            let position_id =
                u32(${i.getByOffset(`position_ids_idx`)}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${r.getByOffset(`i`)} * ${a.get(`position_id`,`bsnh[3]`)} -
                ${r.getByOffset(`j`)} * ${o.get(`position_id`,`bsnh[3]`)};
            ${s.setByOffset(`i`,`re`)}
            let im = ${r.getByOffset(`i`)} * ${o.get(`position_id`,`bsnh[3]`)} +
                ${r.getByOffset(`j`)} * ${a.get(`position_id`,`bsnh[3]`)};
            ${s.setByOffset(`j`,`im`)}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${s.setByOffset(`k`,r.getByOffset(`k`))}
          }
        }`},getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(f)/xn)},programUniforms:m})}},oc=(e,t)=>{ic(e.inputs,t),e.compute(ac(e.inputs,t))}}),cc,lc,uc,dc,fc,pc=o(()=>{V(),I(),Jr(),Ys(),rc(),Hn(),sc(),q(),cc=(e,t)=>{if(t.doRotary&&e.length<=7)throw Error(`cos_cache and sin_cache inputs are required if do_rotary is specified`);let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4];if(t.doRotary!==0&&e.length<=7)throw Error(`cos_cast and sin_cache are expected if do_rotary attribute is non-zero`);if(t.localWindowSize!==-1)throw Error(`Local attention is not supported`);if(t.softcap!==0)throw Error(`Softcap is not supported`);if(t.rotaryInterleaved!==0)throw Error(`Rotary interleaved is not supported`);if(t.smoothSoftmax)throw Error(`Smooth softmax is not supported`);if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input query is expected to have 3 or 5 dimensions`);let s=n.dims[0],c=n.dims[1],l=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],u=c,d=0,f=!r||r.dims.length===0,p=Math.floor(f?l/(t.numHeads+2*t.kvNumHeads):l/t.numHeads);f&&(l=p*t.numHeads);let m=a&&a.dims.length!==0,h=o&&o.dims.length!==0;if(m&&a.dims.length===4&&a.dims[0]===s&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===p)throw Error(`BSNH pastKey/pastValue is not supported`);if(m&&h){if(a.dims.length!==4)throw Error(`Input "past_key" is expected to have 4 dimensions`);if(o.dims.length!==4)throw Error(`Input "past_value" is expected to have 4 dimensions`);d=a.dims[2]}else if(m||h)throw Error(`Input "past_key" and "past_value" shall be both present or both absent`);let g=1;if(r&&r.dims.length>0){if(n.dims.length!==3)throw Error(`Input "query" is expected to have 3 dimensions when key is given`);if(r.dims.length<3||r.dims.length>5)throw Error(`Input "key" is expected to have 3, 4, or 5 dimensions`);if(n.dims[0]!==r.dims[0])throw Error(`Input "query" and "key" shall have same dim 0 (batch size)`);if(r.dims.length===3){if(n.dims[2]%r.dims[2]!==0)throw Error(`Dimension 2 of "query" should be a multiple of "key"`);u=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==p)throw Error(`Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv`);if(i)throw Error(`Expect "value" be none when "key" has packed kv format.`);u=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==p)throw Error(`Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key`);u=r.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input "query" is expected to have 3 or 5 dimensions when key is empty`);if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw Error(`Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv`);g=3}let _=!1,v=t.kvNumHeads?p*t.kvNumHeads:l;if(i&&i.dims.length>0){if(i.dims.length!==3&&i.dims.length!==4)throw Error(`Input "value" is expected to have 3 or 4 dimensions`);if(n.dims[0]!==i.dims[0])throw Error(`Input "query" and "value" shall have same dim 0 (batch_size)`);if(i.dims.length===3){if(u!==i.dims[1])throw Error(`Input "key" and "value" shall have the same dim 1 (kv_sequence_length)`);v=i.dims[2]}else{if(u!==i.dims[2])throw Error(`Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)`);v=i.dims[1]*i.dims[3],_=!0}}let y=e.length>4?e[5]:void 0;if(y){if(y.dims.length===0)throw Error(`seqlens_k must be at least 1D, got scalar.`);let e=y.dims.reduce((e,t)=>e*t,1);if(e!==s)throw Error(`seqlens_k must have batch_size (${s}) elements, got ${e}.`);for(let e=0;e<y.dims.length;e++)if(y.dims[e]!==1&&y.dims[e]!==s)throw Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${s}), got dims[${e}] = ${y.dims[e]}.`)}return{batchSize:s,sequenceLength:c,pastSequenceLength:d,kvSequenceLength:u,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:l,vHiddenSize:v,headSize:p,vHeadSize:Math.floor(v/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:0,scale:t.scale,broadcastResPosBias:!1,passPastInKv:_,qkvFormat:g}},lc=B({perm:[0,2,1,3]}),uc=(e,t,n)=>{let r=t,i=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(r=t.reshape([n.batchSize,n.kvSequenceLength,i,n.headSize]),r=e.compute(zn(r,lc.perm),{inputs:[r],outputs:[-1]})[0]),r},dc=(e,t,n,r)=>{let i=[`type`,`type`],a=[e*t],o=e*t,s=[{type:12,data:o},{type:12,data:t},{type:12,data:e}];return{name:`GeneratePositionIds`,shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:a,dataType:7}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:s}),getShaderSource:e=>{let t=G(`seq_lens`,n.dataType,n.dims),i=G(`total_seq_lens`,r.dataType,r.dims),o=K(`pos_ids`,7,a);return`
  ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`sequence_length`,type:`u32`},{name:`batch_size`,type:`u32`}]).declareVariables(t,i,o)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let total_sequence_length = u32(${i.getByOffset(`0`)});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${t.getByOffset(`batch_idx`)};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${o.setByOffset(`global_idx`,`pos_id`)}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${o.setByOffset(`global_idx`,`pos_id`)}
    } else if (global_idx < uniforms.batch_size) {
      ${o.setByOffset(`global_idx`,`seqlen`)}
    };
  }
  `}}},fc=(e,t)=>{let n=cc(e.inputs,t);if(e.inputs[0].dims.length===5)throw Error(`Packed QKV is not implemented`);if(e.inputs[1]?.dims.length===5)throw Error(`Packed KV is not implemented`);let r=e.inputs[0],i=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,o=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,s=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,c=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,u=n.kvNumHeads?n.kvNumHeads:n.numHeads,d=B({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,u*n.headSize,u*n.headSize]}),[f,p,m]=!i&&!a?e.compute(ec([r],d),{inputs:[r],outputs:[-1,-1,-1]}):[r,i,a],h,g;if(t.doRotary){let r=e.compute(dc(n.batchSize,n.sequenceLength,c,l),{inputs:[c,l],outputs:[-1]})[0],i=e.inputs[7],a=e.inputs[8],o=B({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),s=[f,r,i,a],u=[-1];h=e.compute(ac(s,o),{inputs:s,outputs:u})[0],s.splice(0,1,p);let d=B({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});g=e.compute(ac(s,d),{inputs:s,outputs:u})[0]}let _=qs(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?h:f,void 0,0),v=uc(e,t.doRotary?g:p,n),y=uc(e,m,n);Gr(e,_,v,y,void 0,void 0,o,s,void 0,n,c,l)}}),mc,hc,gc,_c,vc=o(()=>{I(),z(),Hn(),q(),mc=(e,t,n,r,i,a,o,s)=>{let c=U(a),l=c===1?`f32`:`vec${c}f`,u=c===1?`vec2f`:`mat2x${c}f`,d=i*o,f=64;d===1&&(f=256);let p=[i,o,a/c],m=[i,o,2],h=[`rank`,`type`,`type`],g=[];return g.push(...H(p,m)),e.compute({name:`InstanceNormComputeChannelScaleShift`,shaderCache:{hint:`${c};${s};${f}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:d},programUniforms:g}),getShaderSource:e=>{let i=G(`x`,t.dataType,3,c),a=[i,G(`scale`,n.dataType,n.dims),G(`bias`,r.dataType,r.dims),K(`output`,1,3,2)];return`
  var<workgroup> workgroup_shared : array<${u}, ${f}>;
  const workgroup_size = ${f}u;
  ${e.declareVariables(...a)}
  ${e.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${i.get(`batch`,`channel`,`h`)});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${u}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Dn(`workgroup_shared[0][0]`,c)} / f32(hight * ${c});
      let squared_sum_final = ${Dn(`workgroup_shared[0][1]`,c)} / f32(hight * ${c});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${s}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`}},{inputs:[t,n,r],outputs:[-1]})[0]},hc=(e,t,n)=>{let r=t[0].dims,i=r,a=r[0],o=r[1],s=R.sizeFromDimension(r,2),c=U(s),l=R.size(i)/c,u=mc(e,t[0],t[1],t[2],a,s,o,n.epsilon),d=[a,o,s/c],f=[a,o];e.compute({name:`InstanceNormalization`,shaderCache:{hint:`${c}`,inputDependencies:[`type`,`none`]},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:[{type:12,data:l},...H(d,f,d)]}),getShaderSource:e=>{let n=G(`x`,t[0].dataType,d.length,c),r=G(`scale_shift`,1,f.length,2),i=K(`output`,t[0].dataType,d.length,c),a=[n,r,i];return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(...a)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let outputIndices = ${i.offsetToIndices(`global_idx`)};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${r.getByIndices(`vec2<u32>(batch, channel)`)};
      let value = ${n.getByOffset(`global_idx`)} * ${i.type.value}(scale_shift.x) + ${i.type.value}(scale_shift.y);
      ${i.setByOffset(`global_idx`,`value`)};
  }`}},{inputs:[t[0],u]})},gc=(e,t,n)=>{let r=t[0].dims,i=r,a=r[0],o=r[r.length-1],s=R.sizeFromDimension(r,1)/o,c=U(o),l=R.size(i)/c,u=[{type:12,data:s},{type:12,data:Math.floor(o/c)}],d=[`type`,`type`],f=!1,p=[0,r.length-1];for(let e=0;e<r.length-2;e++)f||=r[e+1]!==1,p.push(e+1);f&&=r[r.length-1]!==1;let m=f?e.compute(zn(e.inputs[0],p),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:r.length},(e,t)=>r[p[t]])),h=mc(e,m,t[1],t[2],a,s,o,n.epsilon);e.compute({name:`InstanceNormalizationNHWC`,shaderCache:{hint:`${c}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:u}),getShaderSource:e=>{let n=Cn(t[0].dataType),r=c===1?`vec2f`:`mat${c}x2f`,a=e=>{let t=e===0?`x`:`y`,r=c===1?`f32`:`vec${c}f`;switch(c){case 1:return`${n}(${r}(scale.${t}))`;case 2:return`vec2<${n}>(${r}(scale[0].${t}, scale[1].${t}))`;case 4:return`vec4<${n}>(${r}(scale[0].${t}, scale[1].${t}, scale[2].${t}, scale[3].${t}))`;default:throw Error(`Not supported compoents ${c}`)}},o=G(`input`,t[0].dataType,t[0].dims,c),s=K(`output`,t[0].dataType,i,c);return`
  @group(0) @binding(0) var<storage, read> input : array<${o.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${r}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${s.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${e.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${a(0)}, ${a(1)});
  }`}},{inputs:[t[0],h]})},_c=(e,t)=>{t.format===`NHWC`?gc(e,e.inputs,t):hc(e,e.inputs,t)}}),yc,bc,xc,Sc=o(()=>{I(),z(),q(),yc=e=>{if(!e||e.length<2)throw Error(`layerNorm requires at least 2 inputs.`)},bc=(e,t,n)=>{let r=t.simplified,i=e[0].dims,a=e[1],o=!r&&e[2],s=i,c=R.normalizeAxis(t.axis,i.length),l=R.sizeToDimension(i,c),u=R.sizeFromDimension(i,c),d=R.size(a.dims),f=o?R.size(o.dims):0;if(d!==u||o&&f!==u)throw Error(`Size of X.shape()[axis:] == ${u}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${d} and bias size of ${f}`);let p=[];for(let e=0;e<i.length;++e)e<c?p.push(i[e]):p.push(1);let m=U(u),h=[`type`,`type`],g=[{type:12,data:l},{type:1,data:u},{type:12,data:Math.floor(u/m)},{type:1,data:t.epsilon}];o&&h.push(`type`);let _=n>1,v=n>2,y=t=>{let n=Cn(e[0].dataType),i=[G(`x`,e[0].dataType,e[0].dims,m),G(`scale`,a.dataType,a.dims,m)];return o&&i.push(G(`bias`,o.dataType,o.dims,m)),i.push(K(`output`,e[0].dataType,s,m)),_&&i.push(K(`mean_data_output`,1,p)),v&&i.push(K(`inv_std_output`,1,p)),`
  ${t.registerUniforms([{name:`norm_count`,type:`u32`},{name:`norm_size`,type:`f32`},{name:`norm_size_vectorized`,type:`u32`},{name:`epsilon`,type:`f32`}]).declareVariables(...i)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.norm_count`)}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Tn(`f32`,m)};
    var mean_square_vector = ${Tn(`f32`,m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${En(n,m,`x[h + offset]`)};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Dn(`mean_vector`,m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Dn(`mean_square_vector`,m)} / uniforms.norm_size ${r?``:`- mean * mean`} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${En(n,m,`x[j + offset]`)};
      let f32scale = ${En(n,m,`scale[j]`)};
      output[j + offset] = ${i[0].type.value}((f32input ${r?``:`- mean`}) * inv_std_dev * f32scale
        ${o?`+ ${En(n,m,`bias[j]`)}`:``}
      );
    }

    ${_?`mean_data_output[global_idx] = mean`:``};
    ${v?`inv_std_output[global_idx] = inv_std_dev`:``};
  }`},b=[{dims:s,dataType:e[0].dataType}];return _&&b.push({dims:p,dataType:1}),v&&b.push({dims:p,dataType:1}),{name:`LayerNormalization`,shaderCache:{hint:`${m};${n};${r}`,inputDependencies:h},getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:g}),getShaderSource:y}},xc=(e,t)=>{yc(e.inputs),e.compute(bc(e.inputs,t,e.outputCount))}}),Cc,wc,Tc=o(()=>{z(),Ma(),Va(),Cc=e=>{if(!e||e.length!==2)throw Error(`MatMul requires 2 inputs.`);if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw Error(`shared dimension does not match.`)},wc=e=>{Cc(e.inputs);let t=zt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw Error(`Can't use matmul on the given tensors`);let n=t[t.length-1],r=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&r<8)e.compute(ja(e.inputs,{activation:``},t));else{let i=t[t.length-2],a=R.size(e.inputs[0].dims.slice(0,-2)),o=R.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&i===1&&o===1){let i=e.inputs[0].reshape([1,a,r]),o=e.inputs[1].reshape([1,r,n]),s=[1,a,n],c=[i,o];e.compute(Ba(c,{activation:``},t,s),{inputs:c})}else e.compute(Ba(e.inputs,{activation:``},t))}}}),Ec,Dc,Oc,kc,Ac,jc=o(()=>{I(),z(),V(),q(),Ec=(e,t)=>{if(e.length<3||e.length>4)throw Error(`MatMulNBits requires 3 or 4 inputs`);let n=e[0],r=n.dims.length;if(n.dims[r-1]!==t.k)throw Error(`The last dim of input shape does not match the k value`);let i=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,o=e[1];if(!R.areEqual(o.dims,[t.n,i,a]))throw Error(`The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize`);let s=e[2].dims;if(R.size(s)!==t.n*i)throw Error(`scales input size error.`);if(e.length===4){let n=e[3].dims,r=t.n*(t.bits===8?i:Math.floor((i*t.bits+7)/8));if(R.size(n)!==r)throw Error(`zeroPoints input size error.`)}},Dc=(e,t)=>{let n=e[0].dims,r=n.length,i=n[r-2],a=t.k,o=t.n,s=n.slice(0,r-2),c=R.size(s),l=e[1].dims[2]/4,u=e[0].dataType,d=U(t.k),f=U(l),p=U(o),m=s.concat([i,o]),h=i>1&&o/p%2==0?2:1,g=R.size(m)/p/h,_=[],v=[c,i,a/d],y=R.convertShape(e[1].dims).slice();y.splice(-1,1,l/f),_.push(...H(v)),_.push(...H(y)),_.push(...H(e[2].dims)),e.length===4&&_.push(...H(R.convertShape(e[3].dims)));let b=[c,i,o/p];return _.push(...H(b)),{name:`MatMulNBits`,shaderCache:{hint:`${t.blockSize};${t.bits};${d};${f};${p};${h};64`,inputDependencies:Array(e.length).fill(`rank`)},getRunData:()=>({outputs:[{dims:m,dataType:u}],dispatchGroup:{x:g},programUniforms:_}),getShaderSource:n=>{let r=v.length,i=G(`a`,e[0].dataType,r,d),a=G(`b`,12,y.length,f),o=G(`scales`,e[2].dataType,e[2].dims.length),s=[i,a,o],c=e.length===4?G(`zero_points`,12,e[3].dims.length):void 0;c&&s.push(c);let u=b.length,m=K(`output`,e[0].dataType,u,p),g=Cn(e[0].dataType),_=(()=>{switch(d){case 1:return`array<${g}, 8>`;case 2:return`mat4x2<${g}>`;case 4:return`mat2x4<${g}>`;default:throw Error(`${d}-component is not supported.`)}})(),x=Math.floor(32/t.bits),S=Math.floor(x/8),C=()=>{let e=``;for(let n=0;n<S;n++){let r=n*t.bits*4,a=r+t.bits;e+=`
          // reuse a data (pass ${n})
            var input_offset${n>0?n:``} = ${n===0?i.indicesToOffset(`${i.type.indices}(batch, row, word_offset)`):`input_offset`};
            var a_data${n>0?n:``}: ${_};
            for (var j${n>0?n:``}: u32 = 0; j${n>0?n:``} < ${8/d}; j${n>0?n:``}++) {
              a_data${n>0?n:``}[j${n>0?n:``}] = ${i.getByOffset(`input_offset${n>0?n:``}`)};
              input_offset${n>0?n:``}++;
            }
          `;for(let i=0;i<p*h;i++)e+=`
            b_value = ${f===1?`b${i}_data`:`b${i}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${n*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${r}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${a}u) & b_mask);`}
            b_quantized_values = ${_}(${Array.from({length:4},(e,t)=>`${g}(b_value_lower[${t}]), ${g}(b_value_upper[${t}])`).join(`, `)});
            b_dequantized_values = ${d===1?`${_}(${Array.from({length:8},(e,t)=>`(b_quantized_values[${t}] - ${c?`zero_point${i}`:`zero_point`}) * scale${i}`).join(`, `)});`:`(b_quantized_values - ${_}(${Array(8).fill(`${c?`zero_point${i}`:`zero_point`}`).join(`,`)})) * scale${i};`};
            workgroup_shared[local_id.x * ${h} + ${Math.floor(i/p)}]${p>1?`[${i%p}]`:``} += ${Array.from({length:8/d},(e,t)=>`${d===1?`a_data${n>0?n:``}[${t}] * b_dequantized_values[${t}]`:`dot(a_data${n>0?n:``}[${t}], b_dequantized_values[${t}])`}`).join(` + `)};
          `}return e},w=()=>{let e=`
            var col_index = col * ${p};
            ${c?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${2**(t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${g}(${(2**(t.bits-1)).toFixed(1)});`}
            `;for(let n=0;n<p*h;n++)e+=`
            let scale${n} = ${o.getByOffset(`col_index * nBlocksPerCol + block`)};
            ${c?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${c.getByOffset(`zero_point_word_index`)} >> zero_point_bits_offset;
            let zero_point${n} = ${g}((zero_point_word) & ${t.bits===2?`0x3u`:`0xFu`});`:``}
            col_index += 1;`;return e},ee=()=>{let e=`col_index = col * ${p};`;for(let t=0;t<p*h;t++)e+=`
            let b${t}_data = ${a.getByIndices(`${a.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return e+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?`0x03030303u`:`0x0F0F0F0Fu`};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${_};
            var b_dequantized_values: ${_};`,e};return`
        var<workgroup> workgroup_shared: array<${m.type.value}, ${h*64}>;
        ${n.declareVariables(...s,m)}
        ${n.mainStart([64,1,1])}
          let output_indices = ${m.offsetToIndices(`(global_idx / 64) * ${h}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += 64) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/d};
            ${w()}
            for (var word: u32 = 0; word < ${l}; word += ${f}) {
              ${ee()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${C()}
                word_offset += ${x/d};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${h}) {
            var output_value: ${m.type.value} = ${m.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < 64u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${h};
            }
            ${m.setByIndices(`${m.type.indices}(batch, row, col + local_id.x)`,`output_value`)};
          }
        }`}}},Oc=(e,t)=>{let n=e[0].dims,r=n.length,i=n[r-2],a=t.k,o=t.n,s=n.slice(0,r-2),c=R.size(s),l=e[1].dims[2]/4,u=e[0].dataType,d=U(t.k),f=U(l),p=s.concat([i,o]),m=o%8==0?8:o%4==0?4:1,h=128/m,g=Math.floor(32/t.bits),_=h*f*g,v=_/d,y=_/t.blockSize,b=R.size(p)/m,x=[],S=[c,i,a/d],C=R.convertShape(e[1].dims).slice();C.splice(-1,1,l/f),x.push(...H(S)),x.push(...H(C)),x.push(...H(e[2].dims)),e.length===4&&x.push(...H(R.convertShape(e[3].dims)));let w=[c,i,o];return x.push(...H(w)),{name:`BlockwiseMatMulNBits32`,shaderCache:{hint:`${t.blockSize};${d};${f};${h};${m}`,inputDependencies:Array(e.length).fill(`rank`)},getRunData:()=>({outputs:[{dims:p,dataType:u}],dispatchGroup:{x:b},programUniforms:x}),getShaderSource:n=>{let r=S.length,i=G(`a`,e[0].dataType,r,d),a=G(`b`,12,C.length,f),o=G(`scales`,e[2].dataType,e[2].dims.length),s=[i,a,o],c=e.length===4?G(`zero_points`,12,e[3].dims.length):void 0;c&&s.push(c);let l=w.length,u=K(`output`,e[0].dataType,l),p=Cn(e[0].dataType),_=()=>{switch(d){case 1:return`
          let a_data0 = vec4<${p}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${p}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${p}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${p}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw Error(`${d}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${i.type.value}, ${v}>;
        var<workgroup> inter_results: array<array<${u.type.value}, ${h}>, ${m}>;
        ${n.declareVariables(...s,u)}
        ${n.mainStart([h,m,1])}
          let output_indices = ${u.offsetToIndices(`workgroup_index * ${m}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${y} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${v};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${v}; a_offset += 128)
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${i.getByIndices(`${i.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${i.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${y} + local_id.x;
            ${c?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${c.getByOffset(`zero_point_word_index`)} >> zero_point_bits_offset;
            let zero_point = ${p}((zero_point_word) & ${t.bits===2?`0x3u`:`0xFu`});`:`
            // The default zero point is ${2**(t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${p}(${(2**(t.bits-1)).toFixed(1)});`}
            let scale = ${o.getByOffset(`b_row * n_blocks_per_col + block`)};
            let b_data = ${a.getByIndices(`${a.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/d};
            for (var i: u32 = 0; i < ${f}; i++) {
              let b_value = ${f===1?`b_data`:`b_data[i]`};
              ${(()=>{let e=Math.floor(g/8),n=``;for(let r=0;r<e;r++){let e=r*t.bits*4,i=e+t.bits;n+=`
              ${_()}
              {${t.bits===2?`
                let half_word = b_value >> ${r*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${e}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${i}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${p}>(${Array.from({length:4},(e,t)=>`${p}(b_value_lower[${t}]), ${p}(b_value_upper[${t}])`).join(`, `)});
                let b_dequantized_values = (b_quantized_values - mat2x4<${p}>(${Array(8).fill(`zero_point`).join(`,`)})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(e,t)=>`${`dot(a_data${t}, b_dequantized_values[${t}])`}`).join(` + `)};
              }
              word_offset += ${8/d};`}return n})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${m}) {
            var output_value: ${u.type.value} = ${u.type.value}(0);
            for (var b = 0u; b < ${h}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${u.setByIndices(`${u.type.indices}(batch, row, col + local_idx)`,`output_value`)}
            }
          }
        }`}}},kc=(e,t)=>{Ec(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor(`intel`)&&e.adapterInfo.isArchitecture(`gen-12lp`)?e.compute(Oc(e.inputs,t)):e.compute(Dc(e.inputs,t))},Ac=e=>B(e)}),Mc,Nc,Pc,Fc,Ic,Lc,Rc,zc,Bc,Vc=o(()=>{I(),z(),q(),Mc=e=>{if(!e||e.length<1)throw Error(`Too few inputs`);if(e[0].dataType!==1&&e[0].dataType!==10)throw Error(`Input type must be float or float16.`);if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw Error(`The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].`)}},Nc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
            k = i32(${e.indicesGet(`indices`,i)}) - ${W(`uniforms.pads`,i,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${W(`uniforms.x_shape`,i,t)})) {
              break;
            }
            offset += k * i32(${W(`uniforms.x_strides`,i,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${r}
            value = x[offset];
          }
      `},Pc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${W(`uniforms.pads`,i,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${W(`uniforms.x_shape`,i,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${W(`uniforms.x_shape`,i,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${W(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Fc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${W(`uniforms.pads`,i,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${W(`uniforms.x_shape`,i,t)})) {
                  k = i32(${W(`uniforms.x_shape`,i,t)}) - 1;
                }
                offset += k * i32(${W(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Ic=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${W(`uniforms.pads`,i,n)};
                if (k < 0)  {
                  k += i32(${W(`uniforms.x_shape`,i,t)}]);
                }
                if (k >= i32(${W(`uniforms.x_shape`,i,t)})) {
                  k -= i32(${W(`uniforms.x_shape`,i,t)});
                }
                offset += k * i32(${W(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Lc=(e,t,n)=>{switch(n.mode){case 0:return Nc(e,t,n.pads.length);case 1:return Pc(e,t,n.pads.length);case 2:return Fc(e,t,n.pads.length);case 3:return Ic(e,t,n.pads.length);default:throw Error(`Invalid mode`)}},Rc=(e,t)=>{let n=R.padShape(e[0].dims.slice(),t.pads),r=e[0].dims,i=[{type:12,data:R.size(n)},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;return t.mode===0&&i.push({type:a?e[2].dataType:1,data:t.value}),i.push(...H(e[0].dims,n)),{name:`Pad`,shaderCache:{hint:`${t.mode}${a}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(n)/64)},programUniforms:i}),getShaderSource:i=>{let o=K(`output`,e[0].dataType,n.length),s=G(`x`,e[0].dataType,r.length),c=s.type.value,l=Lc(o,r.length,t),u=[{name:`output_size`,type:`u32`},{name:`pads`,type:`i32`,length:t.pads.length}];return t.mode===0&&u.push({name:`constant_value`,type:a?c:`f32`}),`
            ${i.registerUniforms(u).declareVariables(s,o)}
            ${i.mainStart()}
            ${i.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

            let indices = ${o.offsetToIndices(`global_idx`)};

            var value = ${c}(0);
            ${l}
            output[global_idx] = value;
        }`}}},zc=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),r=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,i=e[0].dims.length,a=new Int32Array(2*i).fill(0);if(e.length>=4){let t=e[3].getBigInt64Array();for(let e=0;e<t.length;e++)a[Number(t[e])]=Number(n[e]),a[Number(t[e])+i]=Number(n[e+t.length])}else n.forEach((e,t)=>a[Number(t)]=Number(e));let o=[];return a.forEach(e=>o.push(e)),{mode:t.mode,value:r,pads:o}}else return t},Bc=(e,t)=>{Mc(e.inputs);let n=zc(e.inputs,t);e.compute(Rc(e.inputs,n),{inputs:[0]})}}),Hc,Uc,Wc,Gc,Kc,qc,Jc,Yc,Xc,Zc,Qc,$c,el,tl,nl,rl,il,al,ol,sl=o(()=>{je(),I(),z(),q(),Hc=e=>{if(S.webgpu.validateInputContent&&(!e||e.length!==1))throw Error(`Pool ops requires 1 input.`)},Uc=(e,t,n)=>{let r=t.format===`NHWC`,i=e.dims.slice();r&&i.splice(1,0,i.pop());let a=Object.hasOwnProperty.call(t,`dilations`),o=t.kernelShape.slice(),s=t.strides.slice(),c=a?t.dilations.slice():[],l=t.pads.slice();Bt.adjustPoolAttributes(n,i,o,s,c,l);let u=Bt.computePoolOutputShape(n,i,s,c,o,l,t.autoPad),d=Object.assign({},t);a?Object.assign(d,{kernelShape:o,strides:s,pads:l,dilations:c,cacheKey:t.cacheKey}):Object.assign(d,{kernelShape:o,strides:s,pads:l,cacheKey:t.cacheKey});let f=u.slice();return f.push(f.splice(1,1)[0]),[d,r?f:u]},Wc=(e,t)=>{let n=t.format===`NHWC`,r=R.size(e),i=R.size(t.kernelShape),a=[{type:12,data:r},{type:12,data:i}],o=[{name:`outputSize`,type:`u32`},{name:`kernelSize`,type:`u32`}];if(t.kernelShape.length<=2){let e=t.kernelShape[t.kernelShape.length-1],n=t.strides[t.strides.length-1],r=t.pads[t.pads.length/2-1],i=t.pads[t.pads.length-1],s=!!(r+i);a.push({type:12,data:e},{type:12,data:n},{type:12,data:r},{type:12,data:i}),o.push({name:`kw`,type:`u32`},{name:`sw`,type:`u32`},{name:`pwStart`,type:`u32`},{name:`pwEnd`,type:`u32`});let c=!1;if(t.kernelShape.length===2){let e=t.kernelShape[t.kernelShape.length-2],n=t.strides[t.strides.length-2],r=t.pads[t.pads.length/2-2],i=t.pads[t.pads.length-2];c=!!(r+i),a.push({type:12,data:e},{type:12,data:n},{type:12,data:r},{type:12,data:i}),o.push({name:`kh`,type:`u32`},{name:`sh`,type:`u32`},{name:`phStart`,type:`u32`},{name:`phEnd`,type:`u32`})}return[a,o,!0,s,c]}else{if(n)throw Error(`Pooling with kernelShape.length > 2 is not supported for NHWC format.`);let e=R.computeStrides(t.kernelShape);return a.push({type:12,data:e},{type:12,data:t.pads},{type:12,data:t.strides}),o.push({name:`kernelStrides`,type:`u32`,length:e.length},{name:`pads`,type:`u32`,length:t.pads.length},{name:`strides`,type:`u32`,length:t.strides.length}),[a,o,!!t.pads.reduce((e,t)=>e+t),!1,!1]}},Gc=(e,t,n,r,i,a,o,s,c,l,u,d)=>{let f=i.format===`NHWC`,p=t.type.value,m=K(`output`,t.type.tensor,r);if(i.kernelShape.length<=2){let r=``,l=``,h=``,g=n-(f?2:1);if(r=u?`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${g}] < 0 || xIndices[${g}]
                      >= uniforms.x_shape[${g}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset(`xIndices`)}];
                  ${a}
                }`:`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset(`xIndices`)}];
                  ${a}
                }`,i.kernelShape.length===2){let e=n-(f?3:2);l=d?`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${e}] < 0 || xIndices[${e}] >= uniforms.x_shape[${e}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                `,h=`
              }
            `}return`
            ${e.registerUniforms(c).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

              let indices = ${m.offsetToIndices(`global_idx`)};
              var xIndices = ${m.offsetToIndices(`global_idx`)};

              var value = ${p}(${s});
              var pad = 0;
              ${l}
              ${r}
              ${h}
              ${o}

              output[global_idx] = value;
            }`}else{if(f)throw Error(`Pooling with kernelShape.length > 2 is not supported for NHWC format.`);let r=i.kernelShape.length,u=i.pads.length,d=``;return d=l?`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset(`xIndices`)}];
                ${a}
              }`:`
              }
              let x_val = x[${t.indicesToOffset(`xIndices`)}];
              ${a}
            `,`
            ${e.registerUniforms(c).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
              let indices = ${m.offsetToIndices(`global_idx`)};
              var xIndices = ${m.offsetToIndices(`global_idx`)};

              var offsets: array<u32, ${r}>;

              var value = ${p}(${s});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${r-1}u; j++) {
                  offsets[j] = offset / ${W(`uniforms.kernelStrides`,`j`,r)};
                  offset -= offsets[j] * ${W(`uniforms.kernelStrides`,`j`,r)};
                }
                offsets[${r-1}] = offset;

                isPad = false;
                for (var j = ${n-r}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${W(`uniforms.strides`,`j - ${n-r}u`,r)}
                    + offsets[j - ${n-r}u] - ${W(`uniforms.pads`,`j - 2u`,u)};
                  ${d}
              }
              ${o}

              output[global_idx] = value;
            }`}},Kc=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,qc=e=>`${Kc(e)};${e.countIncludePad}`,Jc=e=>`${Kc(e)};${e.storageOrder};${e.dilations}`,Yc=e=>({format:e.format,autoPad:[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Xc=(e,t,n,r)=>{let[i,a]=Uc(t,r,n),o=G(`x`,t.dataType,t.dims.length),s=o.type.value,c=``;i.countIncludePad?c+=`value /= ${s}(uniforms.kernelSize);`:c+=`value /= ${s}(i32(uniforms.kernelSize) - pad);`;let[l,u,d,f,p]=Wc(a,i);return l.push(...H(t.dims,a)),{name:e,shaderCache:{hint:`${r.cacheKey};${d};${f};${p}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(a)/64)},programUniforms:l}),getShaderSource:e=>Gc(e,o,t.dims.length,a.length,i,`value += x_val;`,c,0,u,d,f,p)}},Zc=e=>{let t=e.count_include_pad!==0,n=Yc(e);if(n.ceilMode!==0)throw Error(`using ceil() in shape computation is not yet supported for AveragePool`);let r={countIncludePad:t,...n,cacheKey:``};return{...r,cacheKey:qc(r)}},Qc=(e,t)=>{Hc(e.inputs),e.compute(Xc(`AveragePool`,e.inputs[0],!1,t))},$c={autoPad:``,ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},el=e=>{let t=e.format;return{format:t,...$c,cacheKey:t}},tl=(e,t)=>{Hc(e.inputs),e.compute(Xc(`GlobalAveragePool`,e.inputs[0],!0,t))},nl=(e,t,n,r)=>{let[i,a]=Uc(t,r,n),o=G(`x`,t.dataType,t.dims.length),s=[`rank`],[c,l,u,d,f]=Wc(a,i);return c.push(...H(t.dims,a)),{name:e,shaderCache:{hint:`${r.cacheKey};${u};${d};${f}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(a)/64)},programUniforms:c}),getShaderSource:e=>Gc(e,o,t.dims.length,a.length,i,`
      value = max(x_val, value);
    `,``,t.dataType===10?-65504:-1e5,l,u,d,f)}},rl=(e,t)=>{Hc(e.inputs),e.compute(nl(`MaxPool`,e.inputs[0],!1,t))},il=e=>{let t=e.storage_order,n=e.dilations,r=Yc(e);if(t!==0)throw Error(`column major storage order is not yet supported for MaxPool`);if(r.ceilMode!==0)throw Error(`using ceil() in shape computation is not yet supported for MaxPool`);let i={storageOrder:t,dilations:n,...r,cacheKey:``};return{...i,cacheKey:Jc(i)}},al=e=>{let t=e.format;return{format:t,...$c,cacheKey:t}},ol=(e,t)=>{Hc(e.inputs),e.compute(nl(`GlobalMaxPool`,e.inputs[0],!0,t))}}),cl,ll,ul,dl,fl=o(()=>{I(),z(),V(),q(),cl=(e,t)=>{if(e.length<2||e.length>3)throw Error(`DequantizeLinear requires 2 or 3 inputs.`);if(e.length===3&&e[1].dims===e[2].dims)throw Error(`x-scale and x-zero-point must have the same shape.`);if(e.length===3&&e[0].dataType!==e[2].dataType)throw Error(`x and x-zero-point must have the same data type.`);if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw Error(`scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.`);if(e.length>2){if(e[0].dataType!==e[2].dataType)throw Error(`x and x-zero-point must have the same data type.`);if(e[1].dims.length!==e[2].dims.length)throw Error(`scale and zero-point inputs must have the same rank.`);if(!e[1].dims.map((t,n)=>t===e[2].dims[n]).reduce((e,t)=>e&&t,!0))throw Error(`scale and zero-point inputs must have the same shape.`)}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw Error(`blockSize must be set only for block quantization.`);if(!e[1].dims.map((n,r)=>r===t.axis||n===e[0].dims[r]).reduce((e,t)=>e&&t,!0))throw Error(`For block qunatization, scale input shape to match the input shape except for the axis`);if(e[1].dims.length!==e[0].dims.length)throw Error(`For block qunatization the scale input rank must be the same as the x rank.`);let n=e[0].dims[t.axis],r=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/r)||t.blockSize>Math.ceil(n/(r-1)-1))throw Error(`blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].`)}},ll=(e,t)=>{let n=R.normalizeAxis(t.axis,e[0].dims.length),r=e[0].dataType,i=r===3,a=e[0].dims,o=e[1].dataType,s=R.size(a),c=r===3||r===2,l=c?[Math.ceil(R.size(e[0].dims)/4)]:e[0].dims,u=e[1].dims,d=e.length>2?e[2]:void 0,f=d?c?[Math.ceil(R.size(d.dims)/4)]:d.dims:void 0,p=u.length===0||u.length===1&&u[0]===1,m=p===!1&&u.length===1,h=U(s),g=p&&(!c||h===4),_=g?h:1,v=g&&!c?h:1,y=G(`input`,c?12:r,l.length,v),b=G(`scale`,o,u.length),x=d?G(`zero_point`,c?12:r,f.length):void 0,S=K(`output`,o,a.length,_),C=[y,b];x&&C.push(x);let w=[l,u];d&&w.push(f);let ee=[{type:12,data:s/_},{type:12,data:n},{type:12,data:t.blockSize},...H(...w,a)];return{name:`DequantizeLinear`,shaderCache:{hint:t.cacheKey,inputDependencies:x?[`rank`,`rank`,`rank`]:[`rank`,`rank`]},getShaderSource:e=>`
      ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`axis`,type:`u32`},{name:`block_size`,type:`u32`}]).declareVariables(...C,S)}
      ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          let output_indices = ${S.offsetToIndices(`global_idx`)};

          // Set input x
          ${c?`
            let input = ${y.getByOffset(`global_idx / 4`)};
            let x_vec = ${i?`unpack4xI8(input)`:`unpack4xU8(input)`};
            let x_value = ${_===1?`x_vec[global_idx % 4]`:`x_vec`};`:`let x_value = ${y.getByOffset(`global_idx`)};`};

          // Set scale input
          ${p?`let scale_value= ${b.getByOffset(`0`)}`:m?`
            let scale_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
            let scale_value= ${b.getByOffset(`scale_index`)};`:`
            var scale_indices: ${b.type.indices} = output_indices;
            let index = ${b.indicesGet(`scale_indices`,`uniforms.axis`)} / uniforms.block_size;
            ${b.indicesSet(`scale_indices`,`uniforms.axis`,`index`)};
            let scale_value= ${b.getByIndices(`scale_indices`)};`};

          // Set zero-point input
          ${x?p?c?`
                let zero_point_input = ${x.getByOffset(`0`)};
                let zero_point_vec =  ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${x.getByOffset(`0`)}`:m?c?`
                let zero_point_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
                let zero_point_input = ${x.getByOffset(`zero_point_index / 4`)};
                let zero_point_vec =  ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
                let zero_point_value = ${x.getByOffset(`zero_point_index`)};`:c?`
                let zero_point_offset = ${b.indicesToOffset(`scale_indices`)};
                let zero_point_input = ${x.getByOffset(`zero_point_offset / 4`)};
                let zero_point_vec = ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${x.getByIndices(`scale_indices`)};`:`let zero_point_value = ${c?i?`i32`:`u32`:y.type.value}(0);`};
      // Compute and write output
      ${S.setByOffset(`global_idx`,`${S.type.value}(x_value - zero_point_value) * scale_value`)};
      }`,getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(s/_/64),y:1,z:1},programUniforms:ee})}},ul=(e,t)=>{cl(e.inputs,t),e.compute(ll(e.inputs,t))},dl=e=>B({axis:e.axis,blockSize:e.blockSize})}),pl,ml,hl,gl=o(()=>{je(),I(),q(),pl=(e,t,n)=>{if(e===t||e<t&&n<0||e>t&&n>0)throw Error(`Range these inputs' contents are invalid.`)},ml=(e,t,n,r)=>{let i=Math.abs(Math.ceil((t-e)/n)),a=[i],o=i,s=[{type:12,data:o},{type:r,data:e},{type:r,data:n},...H(a)];return{name:`Range`,shaderCache:{hint:`${r}`},getShaderSource:e=>{let t=K(`output`,r,a.length),n=t.type.value,i=[{name:`outputSize`,type:`u32`},{name:`start`,type:n},{name:`delta`,type:n}];return`
        ${e.registerUniforms(i).declareVariables(t)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
        output[global_idx] = uniforms.start + ${n}(global_idx) * uniforms.delta;
      }`},getRunData:()=>({outputs:[{dims:a,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:s})}},hl=e=>{let t=0,n=0,r=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],r=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],r=e.inputs[2].getFloat32Array()[0]),S.webgpu.validateInputContent&&pl(t,n,r),e.compute(ml(t,n,r,e.inputs[0].dataType),{inputs:[]})}}),_l,vl,yl,bl,xl=o(()=>{I(),z(),V(),q(),_l=(e,t,n,r)=>{if(e!==`none`&&r!==`i32`&&r!==`u32`&&r!==`f32`)throw Error(`Input ${r} is not supported with reduction ${e}.`);let i=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case`none`:return`${t}=${n};`;case`add`:return r===`i32`||r===`u32`?`atomicAdd(&${t}, bitcast<${r}>(${n}));`:`
              ${i}bitcast<${r}>(oldValue) + (${n})${a}`;case`max`:return r===`i32`||r===`u32`?`atomicMax(&${t}, bitcast<${r}>(${n}));`:`
                ${i}max(bitcast<f32>(oldValue), (${n}))${a}`;case`min`:return r===`i32`||r===`u32`?`atomicMin(&${t}, bitcast<${r}>(${n}));`:`${i}min(bitcast<${r}>(oldValue), (${n}))${a}`;case`mul`:return`${i}(bitcast<${r}>(oldValue) * (${n}))${a}`;default:throw Error(`Reduction ${e} is not supported.`)}},vl=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n,a=Math.ceil(R.sizeToDimension(r,r.length-1)/1),o=r[r.length-1],s=R.sizeFromDimension(n,o),c=[{type:12,data:a},{type:12,data:o},{type:12,data:s},...H(e[1].dims,e[2].dims,i)];return{name:`ScatterND`,shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:n=>{let r=G(`indices`,e[1].dataType,e[1].dims.length),a=G(`updates`,e[2].dataType,e[2].dims.length,1),o=t.reduction!==`none`&&t.reduction!==``?kn(`output`,e[0].dataType,i.length):K(`output`,e[0].dataType,i.length,1);return`
      ${n.registerUniform(`output_size`,`u32`).registerUniform(`last_index_dimension`,`u32`).registerUniform(`num_updates_elements`,`u32`).declareVariables(r,a,o)}
      ${n.mainStart()}
        ${n.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${_l(t.reduction,`output[data_offset + i]`,`value`,o.type.value)}
  }

      }`}}},yl=e=>B({reduction:e.reduction}),bl=(e,t)=>{e.compute(vl(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Sl,Cl,wl,Tl,El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl,Fl,Il,Ll,Rl,zl,Bl,Vl,Hl=o(()=>{I(),z(),V(),q(),Sl=(e,t)=>{if(e.every(e=>e>0||(()=>{throw Error(`Resize requires scales input values to be positive`)})),e.length>0){if(t.mode===`linear`){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode===`cubic`&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw Error(`Resize requires scales input size to be 2 or 4 for cubic mode`)}},Cl=(e,t,n)=>{t.every(e=>e>=0&&e<n||(()=>{throw Error(`Resize requires axes input values to be positive and less than rank`)}));let r=Array(n).fill(1);return t.forEach((t,n)=>r[t]=e[n]),r},wl=(e,t,n,r,i,a)=>{let[o,s,c]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(o>0&&e.length>o&&e[o].dims.length>0)e[o].getFloat32Array().forEach(e=>a.push(e));else if(t.coordinateTransformMode===`tf_crop_and_resize`)throw Error(`Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize`);if(s>0&&e.length>s&&e[s].dims.length===1&&e[s].dims[0]>0){if(e[s].getFloat32Array().forEach(e=>r.push(e)),r.length!==0&&r.length!==l&&n>=18&&r.length!==t.axes.length)throw Error(`Resize requires scales input size to be same as input rank or axes size for opset 18 and up`);Sl(r,t),t.axes.length>0&&Cl(r,t.axes,l).forEach((e,t)=>r[t]=e)}if(c>0&&e.length>c&&e[c].dims.length===1&&e[c].dims[0]>0&&(e[c].getBigInt64Array().forEach(e=>i.push(Number(e))),i.length!==0&&i.length!==l&&n>=18&&i.length!==t.axes.length))throw Error(`Resize requires sizes input size to be same as input rank or axes size for opset 18 and up`);if(t.axes.length>0){if(r.length!==0&&r.length!==t.axes.length)throw Error(`Resize requires "scales" input size to be of axes rank when axes attributes is specified`);if(i.length!==0&&i.length!==t.axes.length)throw Error(`Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified`)}if(typeof r<`u`&&typeof i<`u`&&r.length>0&&i.length>l)throw Error(`Resize requires only of scales or sizes to be specified`)},Tl=(e,t,n,r)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${r}(big / (${n}));
  let fract = ${r}(big % (${n})) / ${r}(${n});
  return whole + fract;
`,El=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case`asymmetric`:return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Tl(`xResized`,`lengthOriginal`,`lengthResized`,t)}
          }
        `;case`pytorch_half_pixel`:return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case`tf_half_pixel_for_nn`:return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case`align_corners`:return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Tl(`xResized`,`lengthOriginal - 1`,`lengthResized - 1`,t)}
                  }`;case`tf_crop_and_resize`:return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case`half_pixel_symmetric`:return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case`half_pixel`:return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw Error(`Coordinate transform mode ${e} is not supported`)}})()+`}`,Dl=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case`round_prefer_ceil`:return`if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }`;case`floor`:return`return floor(xOriginal);`;case`ceil`:return`return ceil(xOriginal);`;case`round_prefer_floor`:return`if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }`;default:if(t<11)return`if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }`;throw Error(`Nearest mode ${e} is not supported`)}})()+`}`,Ol=(e,t,n)=>{let r=Array(n).fill(0).concat(Array(n).fill(1)),i=e.length===0?r:e.slice();return t.length>0?(t.forEach((e,a)=>{r[e]=i[a],r[a+n]=i[t.length+a]}),r):i},kl=(e,t,n,r)=>{let i=[];if(n.length>0)if(r.length>0){if(e.forEach(e=>i.push(e)),Math.max(...r)>e.length)throw Error(`axes is out of bound`);r.forEach((e,t)=>i[e]=n[t])}else n.forEach(e=>i.push(e));else{if(t.length===0)throw Error(`Resize requires either scales or sizes.`);i=e.map((e,n)=>Math.round(e*t[n]))}return i},Al=(e,t,n)=>{let r=(()=>{switch(n.keepAspectRatioPolicy){case`not_larger`:return n.axes.length>0?Math.min(...n.axes.map(e=>t[e]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case`not_smaller`:return n.axes.length>0?Math.max(...n.axes.map(e=>t[e]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let i=e.slice();return n.axes.length>0?(n.axes.forEach(e=>t[e]=r),n.axes.forEach(n=>i[n]=Math.round(e[n]*t[n]))):(t.fill(r,0,t.length),i.forEach((e,n)=>i[n]=Math.round(e*t[n]))),i},jl=(e,t,n,r,i)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet(`output_indices`,`i`)};
        var scale = ${W(`uniforms.scales`,`i`,r)};
        var roi_low = ${W(`uniforms.roi`,`i`,i)};
        var roi_hi = ${W(`uniforms.roi`,`i + ${t.length}`,i)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${W(`uniforms.input_shape`,`i`,t.length)};
          var output_shape_i = ${W(`uniforms.output_shape`,`i`,n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Ml=(e,t,n,r,i,a,o)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${t.indicesGet(`output_indices`,`i`)};
        var input_index: u32;
        var scale = ${W(`uniforms.scales`,`i`,i)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${W(`uniforms.roi`,`i`,a)};
          var roi_hi = ${W(`uniforms.roi`,`i + ${n.length}`,a)};
          var input_shape_i = ${W(`uniforms.input_shape`,`i`,n.length)};
          var output_shape_i = ${W(`uniforms.output_shape`,`i`,r.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${o} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet(`input_indices`,`i`,`input_index`)}
      }
      return input_indices;
    }`,Nl=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet(`input_indices`,`i`)};
        if (input_index < 0 || input_index >= ${W(`uniforms.input_shape`,`i`,t.length)}) {
          return false;
        }
      }
      return true;
    }`,Pl=(e,t,n,r)=>e.rank>r?`
    ${e.indicesSet(`input_indices`,t,`channel`)};
    ${e.indicesSet(`input_indices`,n,`batch`)};
`:``,Fl=(e,t,n,r,i)=>{let[a,o,s,c]=n.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet(`input_indices`,o,`max(0, min(row, ${n[o]} - 1))`)};
      ${e.indicesSet(`input_indices`,s,`max(0, min(col, ${n[s]} - 1))`)};
      ${Pl(e,c,a,2)}
      return ${e.getByIndices(`input_indices`)};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${o}];
      var col:${l} = originalIndices[${s}];
      ${r?`if (row < 0 || row > (${n[o]} - 1) || col < 0 || col > (${n[s]} - 1)) {
        return ${i};
      }`:``};
      row = max(0, min(row, ${n[o]} - 1));
      col = max(0, min(col, ${n[s]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${c}])`:`0`};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${a}])`:`0`};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Il=(e,t,n,r,i,a,o,s,c,l)=>{let[u,d]=n.length===2?[0,1]:[2,3],f=e.type.value,p=o=>{let d=o===u?`row`:`col`;return`
      fn ${d}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${f} {
        var output_index = ${t.indicesGet(`output_indices`,o)};
        var originalIdx: ${f} = getOriginalCoordinateFromResizedCoordinate(output_index, ${i[o]},
        ${r[o]}, ${n[o]}, ${a[o]}, ${a[o]} + ${n.length});
        var fractOriginalIdx: ${f} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${s} && (originalIdx < 0 || originalIdx > (${n[o]} - 1))) {
          return ${c};
        }
        var data: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${d}: ${f} = originalIdx + ${f}(i);
          if (${d} < 0 || ${d} >= ${n[o]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:s?`return ${c};`:`${d} = max(0, min(${d}, ${n[o]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet(`input_indices_copy`,o,`u32(${d})`)};
          data[i + 1] = ${o===u?e.getByIndices(`input_indices_copy`):`rowCubicInterpolation(input_indices_copy, output_indices)`};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${p(u)};
    ${p(d)};
  fn getCubicInterpolationCoefs(s: ${f}) -> array<${f}, 4> {
    var absS = abs(s);
    var coeffs: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${f} = 1.0 - absS;
    var twoMinusAbsS: ${f} = 2.0 - absS;
    var onePlusAbsS: ${f} = 1.0 + absS;
    coeffs[0] = ((${o} * onePlusAbsS - 5 * ${o}) * onePlusAbsS + 8 * ${o}) * onePlusAbsS - 4 * ${o};
    coeffs[1] = ((${o} + 2) * absS - (${o} + 3)) * absS * absS + 1;
    coeffs[2] = ((${o} + 2) * oneMinusAbsS - (${o} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${o} * twoMinusAbsS - 5 * ${o}) * twoMinusAbsS + 8 * ${o}) * twoMinusAbsS - 4 * ${o};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${f}, 4>, coefs: array<${f}, 4>) -> ${f} {
    var coefsSum: ${f} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${f} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Ll=(e,t,n,r,i)=>{let[a,o,s,c,l]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],u=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${u} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet(`input_indices`,o,`max(0, min(depth, ${n[o]} - 1))`)};
      ${e.indicesSet(`input_indices`,s,`max(0, min(height, ${n[s]} - 1))`)};
      ${e.indicesSet(`input_indices`,c,`max(0, min(width, ${n[c]} - 1))`)};
      ${Pl(e,l,a,3)}
      return ${e.getByIndices(`input_indices`)};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${u} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${u} = originalIndices[${o}];
      var height:${u} = originalIndices[${s}];
      var width:${u} = originalIndices[${c}];
      ${r?`if (depth < 0 || depth > (${n[o]} - 1) || height < 0 || height > (${n[s]} - 1) || width < 0 || (width > ${n[c]} - 1)) {
      return ${i};
        }`:``};

    depth = max(0, min(depth, ${n[o]} - 1));
      height = max(0, min(height, ${n[s]} - 1));
      width = max(0, min(width, ${n[c]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${l}])`:`0`};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${a}])`:`0`};

      var x111: ${u} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${u} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${u} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${u} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${u} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${u} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${u} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${u} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${u} = abs(depth - ${u}(depth1));
      var dx2: ${u} = abs(${u}(depth2) - depth);
      var dy1: ${u} = abs(height - ${u}(height1));
      var dy2: ${u} = abs(${u}(height2) - height);
      var dz1: ${u} = abs(width - ${u}(width1));
      var dz2: ${u} = abs(${u}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Rl=(e,t,n,r,i,a)=>{let o=e.dims,s=Ol(a,t.axes,o.length),c=kl(o,r,i,t.axes),l=r.slice();r.length===0&&(l=o.map((e,t)=>e===0?1:c[t]/e),t.keepAspectRatioPolicy!==`stretch`&&(c=Al(o,l,t)));let u=K(`output`,e.dataType,c.length),d=G(`input`,e.dataType,o.length),f=R.size(c),p=o.length===c.length&&o.every((e,t)=>e===c[t]),m=t.coordinateTransformMode===`tf_crop_and_resize`,h=t.extrapolationValue,g=d.type.value;return{name:`Resize`,shaderCache:{hint:`${t.cacheKey}|${n}|${l.length>0?t.mode===`cubic`?l:l.length:``}|${i.length>0?i:``}|${s.length>0?s:``}|${p}|${t.mode===`nearest`?o.length:o}`,inputDependencies:[`rank`]},getShaderSource:e=>`
      ${p?``:`
      ${El(t.coordinateTransformMode,g)};
      ${(()=>{switch(t.mode){case`nearest`:return`
              ${Nl(d,o)};
              ${Dl(t.nearestMode,n,g)};
              ${Ml(d,u,o,c,l.length,s.length,m)};
              `;case`linear`:return`
              ${jl(u,o,c,l.length,s.length)};
              ${(()=>{if(o.length===2||o.length===4)return`${Fl(d,u,o,m,h)}`;if(o.length===3||o.length===5)return`${Ll(d,u,o,m,h)}`;throw Error(`Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.`)})()};
            `;case`cubic`:return`
            ${(()=>{if(o.length===2||o.length===4)return`${Il(d,u,o,c,l,s,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error(`Cubic mode only supports input dims 2 and 4 are supported in linear mode.`)})()};
            `;default:throw Error(`Invalid resize mode`)}})()};
      `}
      ${e.registerUniform(`output_size`,`u32`).registerUniform(`scales`,`f32`,l.length).registerUniform(`roi`,`f32`,s.length).declareVariables(d,u)}
      ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
        ${p?`output[global_idx] = input[global_idx];`:`
        let output_indices = ${u.offsetToIndices(`global_idx`)};
        var input_indices: ${d.type.indices};
        ${(()=>{switch(t.mode){case`nearest`:return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${d.getByIndices(`input_indices`)};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case`linear`:return`output[global_idx] = ${o.length===2||o.length===4?`bilinearInterpolation`:`trilinearInterpolation`}(output_indices);`;case`cubic`:return`output[global_idx] = bicubicInterpolation(output_indices);`;default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`,getRunData:()=>({outputs:[{dims:c,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:l},{type:1,data:s},...H(o,c)]})}},zl=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},Bl=(e,t)=>{let n=[],r=[],i=[],a=zl(e);if(t.antialias!==0)throw Error(`Only default value (0) for Antialias attribute is supported`);wl(e.inputs,t,a,n,r,i),e.compute(Rl(e.inputs[0],t,a,n,r,i),{inputs:[0]})},Vl=e=>{let t=e.antialias,n=e.axes,r=e.coordinateTransformMode,i=e.cubicCoeffA,a=e.excludeOutside!==0,o=e.extrapolationValue,s=e.keepAspectRatioPolicy,c=e.mode,l=e.nearestMode===``?`simple`:e.nearestMode;return B({antialias:t,axes:n,coordinateTransformMode:r,cubicCoeffA:i,excludeOutside:a,extrapolationValue:o,keepAspectRatioPolicy:s,mode:c,nearestMode:l})}}),Ul,Wl,Gl,Kl=o(()=>{I(),z(),q(),Ul=e=>{if(!e||e.length<3)throw Error(`layerNorm requires at least 3 inputs.`);let t=e[0],n=e[1],r=e[2];if(t.dataType!==n.dataType||t.dataType!==r.dataType)throw Error(`All inputs must have the same data type`);if(t.dims.length!==3&&t.dims.length!==2)throw Error(`Input must be 2D or 3D`);if(n.dims.length!==3&&n.dims.length!==2)throw Error(`Skip must be 2D or 3D`);let i=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==i)throw Error(`Skip must have the same hidden size as input`);if(n.dims[n.dims.length-2]!==a)throw Error(`Skip must have the same sequence length as input`);if(r.dims.length!==1)throw Error(`Gamma must be 1D`);if(r.dims[r.dims.length-1]!==i)throw Error(`Gamma must have the same hidden size as input`);if(e.length>3){let t=e[3];if(t.dims.length!==1)throw Error(`Beta must be 1D`);if(t.dims[t.dims.length-1]!==i)throw Error(`Beta must have the same hidden size as input`)}if(e.length>4){let t=e[4];if(t.dims.length!==1)throw Error(`Bias must be 1D`);if(t.dims[t.dims.length-1]!==i)throw Error(`Bias must have the same hidden size as input`)}},Wl=(e,t,n,r)=>{let i=t.simplified,a=e[0].dims,o=R.size(a),s=a,c=o,l=a.slice(-1)[0],u=r?a.slice(0,-1).concat(1):[],d=!i&&e.length>3,f=e.length>4,p=r&&n>1,m=r&&n>2,h=n>3,g=U(l),_=[{type:12,data:c},{type:12,data:g},{type:12,data:l},{type:1,data:t.epsilon}],v=t=>{let n=[{name:`output_size`,type:`u32`},{name:`components`,type:`u32`},{name:`hidden_size`,type:`u32`},{name:`epsilon`,type:`f32`}],r=[G(`x`,e[0].dataType,e[0].dims,g),G(`skip`,e[1].dataType,e[1].dims,g),G(`gamma`,e[2].dataType,e[2].dims,g)];d&&r.push(G(`beta`,e[3].dataType,e[3].dims,g)),f&&r.push(G(`bias`,e[4].dataType,e[4].dims,g)),r.push(K(`output`,e[0].dataType,s,g)),p&&r.push(K(`mean_output`,1,u)),m&&r.push(K(`inv_std_output`,1,u)),h&&r.push(K(`input_skip_bias_sum`,e[0].dataType,s,g));let a=Cn(e[0].dataType),o=Cn(1,g);return`

      ${t.registerUniforms(n).declareVariables(...r)}
      var<workgroup> sum_shared : array<${o}, 64>;
      var<workgroup> sum_squared_shared : array<${o}, 64>;

      ${t.mainStart([64,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / 64;

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / 64;
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == 63) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?`bias[offset1d + i]`:a+`(0.0)`};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${h?`input_skip_bias_sum[offset + i] = value;`:``}
          output[offset + i] = value;
          let f32_value = ${En(a,g,`value`)};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = 64;
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Dn(`sum`,g)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Dn(`square_sum`,g)} / f32(uniforms.hidden_size) ${i?``:`- mean * mean`} + uniforms.epsilon);
        ${p?`mean_output[global_idx] = mean;`:``}
        ${m?`inv_std_output[global_idx] = inv_std_dev;`:``}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${i?``:`- ${a}(mean)`}) *
            ${a}(inv_std_dev) * gamma[offset1d + i]
            ${d?`+ beta[offset1d + i]`:``};
        }
      }`},y=[{dims:s,dataType:e[0].dataType}];return n>1&&y.push({dims:u,dataType:1}),n>2&&y.push({dims:u,dataType:1}),n>3&&y.push({dims:a,dataType:e[0].dataType}),{name:`SkipLayerNormalization`,shaderCache:{hint:`${g};${p};${m};${h}`,inputDependencies:e.map((e,t)=>`type`)},getShaderSource:v,getRunData:()=>({outputs:y,dispatchGroup:{x:Math.ceil(c/l)},programUniforms:_})}},Gl=(e,t)=>{Ul(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(Wl(e.inputs,t,e.outputCount,!1),{outputs:n})}}),ql,Jl,Yl,Xl,Zl,Ql,$l,eu,tu=o(()=>{I(),z(),V(),q(),ql=(e,t)=>{if(!e||e.length<1)throw Error(`too few inputs`);if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw Error(`axes, starts and ends must have the same length`)}else if(t.starts.length!==t.ends.length)throw Error(`starts and ends must have the same length`);e.slice(1).forEach((t,n)=>{if(e[n+1].dataType!==6&&e[n+1].dataType!==7)throw Error(`Input ${n} must be an array of int32 or int64`)})},Jl=(e,t)=>{let n=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(e=>n.push(Number(e)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(e=>n.push(Number(e)));else throw Error(`Input ${t} must be an array of int32 or int64`);return n},Yl=(e,t)=>{if(e.length>1){let t=Jl(e,1),n=Jl(e,2),r=Jl(e,3);return r.length===0&&(r=[...Array(e[0].dims.length).keys()]),B({starts:t,ends:n,axes:r})}else return t},Xl=(e,t,n,r,i)=>{let a=e;return e<0&&(a+=n[r[t]]),i[t]<0?Math.max(0,Math.min(a,n[r[t]]-1)):Math.max(0,Math.min(a,n[r[t]]))},Zl=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${W(`uniforms.input_shape`,`i`,n.length)};
            let steps_i = ${W(`uniforms.steps`,`i`,n.length)};
            let signs_i = ${W(`uniforms.signs`,`i`,n.length)};
            let starts_i = ${W(`uniforms.starts`,`i`,n.length)};
            var output_index = ${t.indicesGet(`output_indices`,`i`)};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet(`input_indices`,`i`,`input_index`)};
          }
          return input_indices;
      }`,Ql=(e,t)=>{let n=e[0].dims,r=R.size(n),i=t.axes.length>0?R.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],a=Jl(e,4);a.forEach(e=>e!==0||(()=>{throw Error(`step cannot be 0`)})),a.length===0&&(a=Array(i.length).fill(1));let o=t.starts.map((e,t)=>Xl(e,t,n,i,a)),s=t.ends.map((e,t)=>Xl(e,t,n,i,a));if(i.length!==o.length||i.length!==s.length)throw Error(`start, ends and axes should have the same number of elements`);if(i.length!==n.length)for(let e=0;e<n.length;++e)i.includes(e)||(o.splice(e,0,0),s.splice(e,0,n[e]),a.splice(e,0,1));let c=a.map(e=>Math.sign(e));a.forEach((e,t,n)=>{if(e<0){let r=(s[t]-o[t])/e,i=o[t];o[t]=i+r*a[t],s[t]=i,n[t]=-e}});let l=n.slice(0);i.forEach((e,t)=>{l[e]=Math.ceil((s[e]-o[e])/a[e])});let u={dims:l,dataType:e[0].dataType},d=K(`output`,e[0].dataType,l.length),f=G(`input`,e[0].dataType,e[0].dims.length),p=R.size(l),m=[{name:`outputSize`,type:`u32`},{name:`starts`,type:`u32`,length:o.length},{name:`signs`,type:`i32`,length:c.length},{name:`steps`,type:`u32`,length:a.length}],h=[{type:12,data:p},{type:12,data:o},{type:6,data:c},{type:12,data:a},...H(e[0].dims,l)];return{name:`Slice`,shaderCache:{hint:`${c.length}_${o.length}_${a.length}`,inputDependencies:[`rank`]},getShaderSource:e=>`
      ${e.registerUniforms(m).declareVariables(f,d)}
        ${Zl(f,d,n)}
        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
          let output_indices = ${d.offsetToIndices(`global_idx`)};
          let input_indices = calculateInputIndices(output_indices);
          ${d.setByOffset(`global_idx`,f.getByIndices(`input_indices`))}
      }`,getRunData:()=>({outputs:[u],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:h})}},$l=(e,t)=>{ql(e.inputs,t);let n=Yl(e.inputs,t);e.compute(Ql(e.inputs,n),{inputs:[0]})},eu=e=>{let t=e.starts,n=e.ends,r=e.axes;return B({starts:t,ends:n,axes:r})}}),nu,ru,iu,au,ou=o(()=>{I(),z(),V(),Hn(),q(),nu=e=>{if(!e||e.length!==1)throw Error(`Softmax op requires 1 input.`)},ru=(e,t)=>{let n=e.inputs[0],r=n.dims,i=R.size(r),a=r.length,o=R.normalizeAxis(t.axis,a),s=o<r.length-1,c,l=[];s?(l=Array.from({length:a},(e,t)=>t),l[o]=a-1,l[a-1]=o,c=e.compute(zn(n,l),{inputs:[n],outputs:[-1]})[0]):c=n;let u=c.dims,d=u[a-1],f=i/d,p=U(d),m=d/p,h=64;f===1&&(h=256);let g=(e,t)=>t===4?`max(max(${e}.x, ${e}.y), max(${e}.z, ${e}.w))`:t===2?`max(${e}.x, ${e}.y)`:t===3?`max(max(${e}.x, ${e}.y), ${e}.z)`:e,_=G(`x`,c.dataType,c.dims,p),v=K(`result`,c.dataType,c.dims,p),y=_.type.value,b=Cn(c.dataType)===`f32`?`var threadMax = ${y}(-3.4028234663852886e+38f);`:`var threadMax = ${y}(-65504.0h);`,x=e.compute({name:`Softmax`,shaderCache:{hint:`${p};${h}`,inputDependencies:[`type`]},getRunData:()=>({outputs:[{dims:u,dataType:c.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:m}]}),getShaderSource:e=>`
      var<workgroup> rowMaxShared : ${y};
      var<workgroup> rowSumShared : ${y};
      var<workgroup> threadShared : array<${y}, ${h}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${y} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${y}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${e.registerUniform(`packedCols`,`i32`).declareVariables(_,v)}
      ${e.mainStart(h)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${h};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${b}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${y}(${g(`threadShared[0]`,p)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${y}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${y}(${Dn(`threadShared[0]`,p)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${y}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`},{inputs:[c],outputs:[s?-1:0]})[0];s&&e.compute(zn(x,l),{inputs:[x]})},iu=(e,t)=>{nu(e.inputs),ru(e,t)},au=e=>B({axis:e.axis})}),su,cu,lu,uu,du,fu=o(()=>{I(),z(),q(),su=e=>Array.from(e.getBigInt64Array(),Number),cu=e=>{if(!e||e.length!==2)throw Error(`Tile requires 2 inputs.`);if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw Error(`Tile only support float, float16, int32, and uint32 data types`);if(e[1].dataType!==7)throw Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw Error("Tile `repeats` input should be 1-D");if(su(e[1]).length!==e[0].dims.length)throw Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},lu=(e,t)=>{let n=[];for(let r=0;r<e.length;++r)n.push(e[r]*t[r]);return n},uu=(e,t)=>{let n=e[0].dims,r=t??su(e[1]),i=lu(n,r),a=R.size(i),o=e[0].dataType,s=G(`input`,o,n.length),c=K(`output`,o,i.length);return{name:`Tile`,shaderCache:{hint:`${r}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...H(e[0].dims,i)]}),getShaderSource:e=>`
      const inputShape = ${s.indices(...n)};
      ${e.registerUniform(`output_size`,`u32`).declareVariables(s,c)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let output_indices = ${c.offsetToIndices(`global_idx`)};
      var input_indices: ${s.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${s.indicesGet(`uniforms.input_shape`,`i`)};
        let input_dim_value = ${c.indicesGet(`output_indices`,`i`)}  % input_dim_i;

        ${s.indicesSet(`input_indices`,`i`,`input_dim_value`)}
      }
      ${c.setByOffset(`global_idx`,s.getByIndices(`input_indices`))}
    }`}},du=e=>{cu(e.inputs),e.compute(uu(e.inputs),{inputs:[0]})}}),pu,mu,hu,gu=o(()=>{I(),z(),q(),pu=(e,t,n,r,i)=>{let a=K(`output_data`,i,n.length,4),o=G(`a_data`,t[1].dataType,t[1].dims.length,4),s=G(`b_data`,t[2].dataType,t[2].dims.length,4),c=G(`c_data`,t[0].dataType,t[0].dims.length,4),l,u=(e,t,n)=>`select(${t}, ${e}, ${n})`;if(!r)l=a.setByOffset(`global_idx`,u(o.getByOffset(`global_idx`),s.getByOffset(`global_idx`),c.getByOffset(`global_idx`)));else{let e=(e,t,n=``)=>{let r=`a_data[index_a${t}][component_a${t}]`,i=`b_data[index_b${t}][component_b${t}]`,l=`bool(c_data[index_c${t}] & (0xffu << (component_c${t} * 8)))`;return`
            let output_indices${t} = ${a.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offset_a${t} = ${o.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_b${t} = ${s.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_c${t} = ${c.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let index_a${t} = offset_a${t} / 4u;
            let index_b${t} = offset_b${t} / 4u;
            let index_c${t} = offset_c${t} / 4u;
            let component_a${t} = offset_a${t} % 4u;
            let component_b${t} = offset_b${t} % 4u;
            let component_c${t} = offset_c${t} % 4u;
            ${e}[${t}] = ${n}(${u(r,i,l)});
          `};l=i===9?`
            var data = vec4<u32>(0);
            ${e(`data`,0,`u32`)}
            ${e(`data`,1,`u32`)}
            ${e(`data`,2,`u32`)}
            ${e(`data`,3,`u32`)}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e(`output_data[global_idx]`,0)}
            ${e(`output_data[global_idx]`,1)}
            ${e(`output_data[global_idx]`,2)}
            ${e(`output_data[global_idx]`,3)}
          `}return`
        ${e.registerUniform(`vec_size`,`u32`).declareVariables(c,o,s,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
        ${l}
      }`},mu=e=>{let t=e[1].dims,n=e[2].dims,r=e[0].dims,i=e[1].dataType,a=!(R.areEqual(t,n)&&R.areEqual(n,r)),o=t,s=R.size(t);if(a){let e=zt.calcShape(zt.calcShape(t,n,!1),r,!1);if(!e)throw Error(`Can't perform where op on the given tensors`);o=e,s=R.size(o)}let c=Math.ceil(s/4);return{name:`Where`,shaderCache:{inputDependencies:[`rank`,`rank`,`rank`]},getShaderSource:t=>pu(t,e,o,a,i),getRunData:()=>({outputs:[{dims:o,dataType:i}],dispatchGroup:{x:Math.ceil(s/64/4)},programUniforms:[{type:12,data:c},...H(r,t,n,o)]})}},hu=e=>{e.compute(mu(e.inputs))}}),_u,vu=o(()=>{zr(),Jr(),$r(),ri(),Qi(),fa(),ya(),po(),To(),ko(),Fo(),qo(),$o(),ns(),ss(),ds(),gs(),xs(),Es(),Vs(),pc(),vc(),Sc(),Tc(),jc(),Ys(),Vc(),sl(),fl(),gl(),xl(),Pr(),Hl(),sc(),Kl(),tu(),ou(),rc(),fu(),Hn(),Ji(),gu(),_u=new Map([[`Abs`,[ai]],[`Acos`,[oi]],[`Acosh`,[si]],[`Add`,[na]],[`ArgMax`,[Lr,Rr]],[`ArgMin`,[Ir,Rr]],[`Asin`,[ci]],[`Asinh`,[li]],[`Atan`,[ui]],[`Atanh`,[di]],[`Attention`,[qr]],[`AveragePool`,[Qc,Zc]],[`BatchNormalization`,[Qr]],[`BiasAdd`,[ni]],[`BiasSplitGelu`,[Zi]],[`Cast`,[pi,fi]],[`Ceil`,[gi]],[`Clip`,[hi]],[`Concat`,[_a,va]],[`Conv`,[fo,so]],[`ConvTranspose`,[wo,bo]],[`Cos`,[_i]],[`Cosh`,[vi]],[`CumSum`,[Do,Oo]],[`DepthToSpace`,[No,Po]],[`DequantizeLinear`,[ul,dl]],[`Div`,[ra]],[`Einsum`,[Go,Ko]],[`Elu`,[bi,yi]],[`Equal`,[ia]],[`Erf`,[Si]],[`Exp`,[Ci]],[`Expand`,[Qo]],[`FastGelu`,[ts]],[`Floor`,[wi]],[`FusedConv`,[fo,so]],[`Gather`,[os,as]],[`GatherElements`,[bs,ys]],[`GatherBlockQuantized`,[ms,hs]],[`GatherND`,[ls,us]],[`Gelu`,[Ti]],[`Gemm`,[Ts,ws]],[`GlobalAveragePool`,[tl,el]],[`GlobalMaxPool`,[ol,al]],[`Greater`,[ca]],[`GreaterOrEqual`,[ua]],[`GridSample`,[zs,Bs]],[`GroupQueryAttention`,[fc]],[`HardSigmoid`,[Ni,Mi]],[`InstanceNormalization`,[_c]],[`LayerNormalization`,[xc]],[`LeakyRelu`,[Ei,yi]],[`Less`,[la]],[`LessOrEqual`,[da]],[`Log`,[Wi]],[`MatMul`,[wc]],[`MatMulNBits`,[kc,Ac]],[`MaxPool`,[rl,il]],[`Mul`,[aa]],[`MultiHeadAttention`,[Js,Ws]],[`Neg`,[Oi]],[`Not`,[Di]],[`Pad`,[Bc]],[`Pow`,[oa]],[`QuickGelu`,[qi,yi]],[`Range`,[hl]],[`Reciprocal`,[ki]],[`ReduceMin`,[kr]],[`ReduceMean`,[Tr]],[`ReduceMax`,[Or]],[`ReduceSum`,[jr]],[`ReduceProd`,[Ar]],[`ReduceL1`,[X]],[`ReduceL2`,[Er]],[`ReduceLogSum`,[Nr]],[`ReduceLogSumExp`,[Dr]],[`ReduceSumSquare`,[Mr]],[`Relu`,[Ai]],[`Resize`,[Bl,Vl]],[`RotaryEmbedding`,[oc]],[`ScatterND`,[bl,yl]],[`Sigmoid`,[ji]],[`Sin`,[Pi]],[`Sinh`,[Fi]],[`Slice`,[$l,eu]],[`SkipLayerNormalization`,[Gl]],[`Split`,[tc,nc]],[`Sqrt`,[Ii]],[`Softmax`,[iu,au]],[`Sub`,[sa]],[`Tan`,[Li]],[`Tanh`,[zi]],[`ThresholdedRelu`,[Ui,yi]],[`Tile`,[du]],[`Transpose`,[Bn,Vn]],[`Where`,[hu]]])}),yu,bu=o(()=>{je(),Lt(),q(),yu=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,r,i){ye(e.programInfo.name);let a=this.backend.device,o=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let s=[];for(let e of t)s.push({binding:s.length,resource:{buffer:e.buffer}});for(let e of n)s.push({binding:s.length,resource:{buffer:e.buffer}});i&&s.push({binding:s.length,resource:i});let c=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:s,label:e.programInfo.name});if(this.backend.sessionStatus===`capturing`){let t={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:c,dispatchGroup:r};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(t)}o.setPipeline(e.computePipeline),o.setBindGroup(0,c),o.dispatchWorkgroups(...r),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType===`at-passes`)&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),be(e.programInfo.name)}dispose(){}build(e,t){ye(e.name);let n=this.backend.device,r=[];[{feature:`shader-f16`,extension:`f16`},{feature:`subgroups`,extension:`subgroups`}].forEach(e=>{n.features.has(e.feature)&&r.push(`enable ${e.extension};`)});let i=Mn(t,this.backend.device.limits),a=e.getShaderSource(i),o=`${r.join(`
`)}
${i.additionalImplementations}
${a}`,s=n.createShaderModule({code:o,label:e.name});L(`verbose`,()=>`[WebGPU] ${e.name} shader code: ${o}`);let c=n.createComputePipeline({compute:{module:s,entryPoint:`main`},layout:`auto`,label:e.name});return be(e.name),{programInfo:e,computePipeline:c,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e==`number`?e:e.x,n=typeof e==`number`?1:e.y||1,r=typeof e==`number`?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=i&&n<=i&&r<=i)return[t,n,r];let a=t*n*r,o=Math.ceil(Math.sqrt(a));if(o>i){if(o=Math.ceil(Math.cbrt(a)),o>i)throw Error(`Total dispatch size exceeds WebGPU maximum.`);return[o,o,o]}else return[o,o,1]}}}),xu={};s(xu,{WebGpuBackend:()=>Tu});var Su,Cu,wu,Tu,Eu=o(()=>{je(),I(),Lt(),Gt(),yn(),vu(),bu(),Su=(e,t)=>{if(t.length!==e.length)throw Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let r=0;r<e.length;++r){let i=e[r].dataType;switch(t[r]){case`none`:n.push(``);break;case`type`:n.push(`${i}`);break;case`rank`:{let t=e[r].dims.length;n.push(`${i};${t}`);break}case`dims`:{let t=e[r].dims.join(`,`);n.push(`${i};${t}`);break}default:throw Error(`unsupported input dependency: ${t[r]}`)}}return n.join(`|`)},Cu=(e,t,n)=>{let r=e.name;return e.shaderCache?.hint&&(r+=`[`+e.shaderCache.hint+`]`),r+=`:`+n+`:${Su(t,e.shaderCache?.inputDependencies??Array(t.length).fill(`dims`))}`,r},wu=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Tu=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus=`default`,this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw Error(`currentKernelCustomData(): currentKernelId is null. (should not happen)`);let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],r={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},i=e=>t.features.has(e)&&n.push(e)&&!0;i(`chromium-experimental-timestamp-query-inside-passes`)||i(`timestamp-query`),i(`shader-f16`),i(`subgroups`),this.device=await t.requestDevice(r),this.adapterInfo=new wu(t.info||await t.requestAdapterInfo()),this.gpuDataManager=vn(this),this.programManager=new yu(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Ft(e.logLevel,!!e.debug),this.device.onuncapturederror=e=>{e.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${e.error.message}`)},Object.defineProperty(this.env.webgpu,`device`,{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,`adapter`,{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<`u`&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||=this.device.createCommandEncoder(),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType===`at-passes`&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&=(this.computePassEncoder.end(),null)}flush(){if(!this.commandEncoder)return;ye(),this.endComputePass();let e;this.queryType!==`none`&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!==`none`&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let e=0;e<t.length/2;e++){let r=n[e],i=r.kernelId,a=this.kernels.get(i),o=a.kernelType,s=a.kernelName,c=r.programName,l=r.inputTensorViews,u=r.outputTensorViews,d=t[e*2],f=t[e*2+1];typeof this.queryTimeBase>`u`&&(this.queryTimeBase=d);let p=Number(d-this.queryTimeBase),m=Number(f-this.queryTimeBase);if(!Number.isSafeInteger(p)||!Number.isSafeInteger(m))throw RangeError(`incorrect timestamp range`);if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:l.map(e=>({dims:e.dims,dataType:St(e.dataType)})),outputsMetadata:u.map(e=>({dims:e.dims,dataType:St(e.dataType)})),kernelId:i,kernelType:o,kernelName:s,programName:c,startTime:p,endTime:m});else{let e=``;l.forEach((t,n)=>{e+=`input[${n}]: [${t.dims}] | ${St(t.dataType)}, `});let t=``;u.forEach((e,n)=>{t+=`output[${n}]: [${e.dims}] | ${St(e.dataType)}, `}),console.log(`[profiling] kernel "${i}|${o}|${s}|${c}" ${e}${t}start time: ${p} ns, execution time: ${m-p} ns`)}_e(`GPU`,`${c}::${d}::${f}`)}e.unmap(),this.pendingQueries.delete(e)}),be()}run(e,t,n,r,i,a){ye(e.name);let o=[];for(let e=0;e<t.length;++e){let n=t[e].data;if(n===0)continue;let r=this.gpuDataManager.get(n);if(!r)throw Error(`no GPU data for input: ${n}`);o.push(r)}let{outputs:s,dispatchGroup:c,programUniforms:l}=e.getRunData(t),u=n.length===0?s.map((e,t)=>t):n;if(u.length!==s.length)throw Error(`Output size ${u.length} must be equal to ${s.length}.`);let d=[],f=[];for(let e=0;e<s.length;++e){if(!Number.isInteger(u[e])||u[e]<-3||u[e]>=a)throw Error(`Invalid output index: ${u[e]}`);if(u[e]===-3)continue;let t=u[e]===-1,n=u[e]===-2,o=t||n?i(s[e].dataType,s[e].dims):r(u[e],s[e].dataType,s[e].dims);if(d.push(o),o.data===0)continue;let c=this.gpuDataManager.get(o.data);if(!c)throw Error(`no GPU data for output: ${o.data}`);if(t&&this.temporaryData.push(c),n){let e=this.kernelPersistentData.get(this.currentKernelId);e||(e=[],this.kernelPersistentData.set(this.currentKernelId,e)),e.push(c)}f.push(c)}if(o.length!==t.length||f.length!==d.length){if(f.length===0)return be(e.name),d;throw Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let p;if(l){let e=0,t=[];l.forEach(n=>{let r=typeof n.data==`number`?[n.data]:n.data;if(r.length===0)return;let i=n.type===10?2:4,a,o;n.type===10?(o=r.length>4?16:r.length>2?8:r.length*i,a=r.length>4?16:i*r.length):(o=r.length<=2?r.length*i:16,a=16),e=Math.ceil(e/o)*o,t.push(e);let s=n.type===10?8:4;e+=r.length>4?Math.ceil(r.length/s)*a:r.length*i}),e=Math.ceil(e/16)*16;let n=new ArrayBuffer(e);l.forEach((e,r)=>{let i=t[r],a=typeof e.data==`number`?[e.data]:e.data;if(e.type===6)new Int32Array(n,i,a.length).set(a);else if(e.type===12)new Uint32Array(n,i,a.length).set(a);else if(e.type===10)new Uint16Array(n,i,a.length).set(a);else if(e.type===1)new Float32Array(n,i,a.length).set(a);else throw Error(`Unsupported uniform type: ${St(e.type)}`)});let r=this.gpuDataManager.create(e,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(r.buffer,0,n,0,e),this.gpuDataManager.release(r.id),p={offset:0,size:e,buffer:r.buffer}}let m=this.programManager.normalizeDispatchGroupSize(c),h=m[1]===1&&m[2]===1,g=Cu(e,t,h),_=this.programManager.getArtifact(g);if(_||(_=this.programManager.build(e,m),this.programManager.setArtifact(g,_),L(`info`,()=>`[artifact] key: ${g}, programName: ${e.name}`)),l&&_.uniformVariablesInfo){if(l.length!==_.uniformVariablesInfo.length)throw Error(`Uniform variables count mismatch: expect ${_.uniformVariablesInfo.length}, got ${l.length} in program "${_.programInfo.name}".`);for(let e=0;e<l.length;e++){let t=l[e],n=t.type,r=typeof t.data==`number`?1:t.data.length,[i,a]=_.uniformVariablesInfo[e];if(n!==i||r!==a)throw Error(`Uniform variable ${e} mismatch: expect type ${i} with size ${a}, got type ${n} with size ${r} in program "${_.programInfo.name}".`)}}if(L(`info`,()=>`[ProgramManager] run "${e.name}" (key=${g}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!==`none`||this.sessionStatus===`capturing`){let e={kernelId:this.currentKernelId,programName:_.programInfo.name,inputTensorViews:t,outputTensorViews:d};this.pendingKernels.push(e),this.sessionStatus===`capturing`&&this.capturedPendingKernels.get(this.currentSessionId).push(e)}return this.programManager.run(_,o,f,m,p),be(e.name),d}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,r){let i=_u.get(e);if(!i)throw Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:r,kernelEntry:i[0],attributes:[i[1],n]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let e of t)this.gpuDataManager.release(e.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let r=this.kernels.get(e);if(!r)throw Error(`kernel not created: ${e}`);let i=r.kernelType,a=r.kernelName,o=r.kernelEntry,s=r.attributes;if(this.currentKernelId!==null)throw Error(`kernel "[${i}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,s[0]&&=(s[1]=s[0](s[1]),void 0),L(`info`,()=>`[WebGPU] Start to run kernel "[${i}] ${a}"...`);let c=this.env.debug;this.temporaryData=[];try{return c&&this.device.pushErrorScope(`validation`),o(t,s[1]),0}catch(e){return n.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${a}" failed. ${e}`)),1}finally{c&&n.push(this.device.popErrorScope().then(e=>e?`GPU validation error for kernel "[${i}] ${a}": ${e.message}`:null));for(let e of this.temporaryData)this.gpuDataManager.release(e.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,r){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let a=i.get(t),o=this.gpuDataManager.registerExternalBuffer(n,r,a);return i.set(t,[o,n]),o}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(e=>this.gpuDataManager.unregisterExternalBuffer(e[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let r=await gn(this,e,t);return Wt(r.buffer,n)}}writeTimestamp(e){this.queryType===`inside-passes`&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType=`none`,(this.env.webgpu.profiling?.mode===`default`||(typeof this.env.trace>`u`?this.env.wasm.trace:this.env.trace))&&(this.device.features.has(`chromium-experimental-timestamp-query-inside-passes`)?this.queryType=`inside-passes`:this.device.features.has(`timestamp-query`)&&(this.queryType=`at-passes`),this.queryType!==`none`&&typeof this.querySet>`u`&&(this.querySet=this.device.createQuerySet({type:`timestamp`,count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){L(`info`,`captureBegin`),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus=`capturing`}captureEnd(){L(`info`,`captureEnd`),this.flush(),this.sessionStatus=`default`}replay(){L(`info`,`replay`),this.sessionStatus=`replaying`;let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let r=0;r<n;r++){let n=this.getComputePassEncoder(),i=e[r];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(i.computePipeline),n.setBindGroup(0,i.bindGroup),n.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!==`none`&&this.pendingKernels.push(t[r]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType===`at-passes`)&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus=`default`}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Du={};s(Du,{init:()=>Au});var Ou,ku,Au,ju=o(()=>{I(),Lt(),z(),cn(),Ou=class e{constructor(e,t,n,r){this.module=e,this.dataType=t,this.data=n,this.dims=r}getFloat32Array(){if(this.dataType!==1)throw Error(`Invalid data type`);let e=R.size(this.dims);return e===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,e)}getBigInt64Array(){if(this.dataType!==7)throw Error(`Invalid data type`);let e=R.size(this.dims);return e===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,e)}getInt32Array(){if(this.dataType!==6)throw Error(`Invalid data type`);let e=R.size(this.dims);return e===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,e)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw Error(`Invalid data type`);let e=R.size(this.dims);return e===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,e)}reshape(t){if(R.size(t)!==R.size(this.dims))throw Error(`Invalid new shape`);return new e(this.module,this.dataType,this.data,t)}},ku=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let r=e.PTR_SIZE,i=n/e.PTR_SIZE,a=r===4?`i32`:`i64`;this.opKernelContext=Number(e.getValue(r*i++,a));let o=Number(e.getValue(r*i++,a));this.outputCount=Number(e.getValue(r*i++,a)),this.customDataOffset=Number(e.getValue(r*i++,`*`)),this.customDataSize=Number(e.getValue(r*i++,a));let s=[];for(let t=0;t<o;t++){let t=Number(e.getValue(r*i++,a)),n=Number(e.getValue(r*i++,`*`)),o=Number(e.getValue(r*i++,a)),c=[];for(let t=0;t<o;t++)c.push(Number(e.getValue(r*i++,a)));s.push(new Ou(e,t,n,c))}this.inputs=s}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let n=t?.inputs?.map(e=>typeof e==`number`?this.inputs[e]:e)??this.inputs,r=t?.outputs??[];return this.backend.run(e,n,r,(e,t,n)=>new Ou(this.module,t,this.output(e,n),n),(e,t)=>{let n=Ct(e,t);if(!n)throw Error(`Unsupported data type: ${e}`);let r=n>0?this.backend.gpuDataManager.create(n).id:0;return new Ou(this.module,e,r,t)},this.outputCount)}output(e,t){let n=this.module.stackSave();try{let n=this.module.PTR_SIZE,r=n===4?`i32`:`i64`,i=this.module.stackAlloc((1+t.length)*n);this.module.setValue(i,t.length,r);for(let e=0;e<t.length;e++)this.module.setValue(i+n*(e+1),t[e],r);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(n){throw Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${n}`)}finally{this.module.stackRestore(n)}}},Au=async(e,t,n,r)=>{let i=t.jsepInit;if(!i)throw Error(`Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.`);if(e===`webgpu`){let e=(Eu(),l(xu)).WebGpuBackend,a=new e;await a.initialize(n,r),i(`webgpu`,[a,e=>a.alloc(Number(e)),e=>a.free(e),(e,n,r,i=!1)=>{if(i)L(`verbose`,()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(e)}, dst=${Number(n)}, size=${Number(r)}`),a.memcpy(Number(e),Number(n));else{L(`verbose`,()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(e)}, gpuDataId=${Number(n)}, size=${Number(r)}`);let i=t.HEAPU8.subarray(Number(e>>>0),Number(e>>>0)+Number(r));a.upload(Number(n),i)}},async(e,n,r)=>{L(`verbose`,()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${e}, dataOffset=${n}, size=${r}`),await a.download(Number(e),()=>t.HEAPU8.subarray(Number(n)>>>0,Number(n+r)>>>0))},(e,n,r)=>a.createKernel(e,Number(n),r,t.UTF8ToString(t._JsepGetNodeName(Number(n)))),e=>a.releaseKernel(e),(e,n,r,i)=>{L(`verbose`,()=>`[WebGPU] jsepRun: sessionHandle=${r}, kernel=${e}, contextDataOffset=${n}`);let o=new ku(t,a,Number(n));return a.computeKernel(Number(e),o,i)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let e=new sn(n);i(`webnn`,[e,()=>e.reserveTensorId(),t=>e.releaseTensorId(t),async(t,n,r,i,a)=>e.ensureTensor(t,n,r,i,a),(t,n)=>{e.uploadTensor(t,n)},async(t,n)=>e.downloadTensor(t,n),(t,n)=>e.registerMLContext(t,n),!!n.trace])}}}),Mu,Nu,Pu,Fu,Iu,Lu,Ru,zu,Bu,Vu,Hu,Uu,Wu,Gu=o(()=>{je(),pt(),bt(),I(),P(),dt(),At(),Mu=(e,t)=>{N()._OrtInit(e,t)!==0&&F(`Can't initialize onnxruntime.`)},Nu=async e=>{Mu(e.wasm.numThreads,Tt(e.logLevel))},Pu=async(e,t)=>{N().asyncInit?.();let n=e.webgpu.adapter;if(t===`webgpu`){if(typeof navigator>`u`||!navigator.gpu)throw Error(`WebGPU is not supported in current environment`);if(n){if(typeof n.limits!=`object`||typeof n.features!=`object`||typeof n.requestDevice!=`function`)throw Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let t=e.webgpu.powerPreference;if(t!==void 0&&t!==`low-power`&&t!==`high-performance`)throw Error(`Invalid powerPreference setting: "${t}"`);let r=e.webgpu.forceFallbackAdapter;if(r!==void 0&&typeof r!=`boolean`)throw Error(`Invalid forceFallbackAdapter setting: "${r}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:t,forceFallbackAdapter:r}),!n)throw Error(`Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.`)}}if(t===`webnn`&&(typeof navigator>`u`||!navigator.ml))throw Error(`WebNN is not supported in current environment`);{let r=(ju(),l(Du)).init;t===`webgpu`&&await r(`webgpu`,N(),e,n),t===`webnn`&&await r(`webnn`,N(),e)}},Fu=new Map,Iu=e=>{let t=N(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,r,r+n)!==0&&F(`Can't get session input/output count.`);let i=n===4?`i32`:`i64`;return[Number(t.getValue(r,i)),Number(t.getValue(r+n,i))]}finally{t.stackRestore(n)}},Lu=(e,t)=>{let n=N(),r=n.stackSave(),i=0;try{let r=n.PTR_SIZE,a=n.stackAlloc(2*r);n._OrtGetInputOutputMetadata(e,t,a,a+r)!==0&&F(`Can't get session input/output metadata.`);let o=Number(n.getValue(a,`*`));i=Number(n.getValue(a+r,`*`));let s=n.HEAP32[i/4];if(s===0)return[o,0];let c=n.HEAPU32[i/4+1],l=[];for(let e=0;e<c;e++){let t=Number(n.getValue(i+8+e*r,`*`));l.push(t===0?Number(n.getValue(i+8+(e+c)*r,`*`)):n.UTF8ToString(t))}return[o,s,l]}finally{n.stackRestore(r),i!==0&&n._OrtFree(i)}},Ru=e=>{let t=N(),n=t._malloc(e.byteLength);if(n===0)throw Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},zu=async(e,t)=>{let n,r,i=N();Array.isArray(e)?[n,r]=e:e.buffer===i.HEAPU8.buffer?[n,r]=[e.byteOffset,e.byteLength]:[n,r]=Ru(e);let a=0,o=0,s=0,c=[],l=[],u=[];try{if([o,c]=await yt(t),t?.externalData&&i.mountExternalData){let e=[];for(let n of t.externalData){let t=typeof n==`string`?n:n.path;e.push(kt(typeof n==`string`?n:n.data).then(e=>{i.mountExternalData(t,e)}))}await Promise.all(e)}for(let e of t?.executionProviders??[])if((typeof e==`string`?e:e.name)===`webnn`){if(i.shouldTransferToMLTensor=!1,typeof e!=`string`){let t=e,n=t?.context,r=t?.gpuDevice,a=t?.deviceType,o=t?.powerPreference;n?i.currentContext=n:r?i.currentContext=await i.webnnCreateMLContext(r):i.currentContext=await i.webnnCreateMLContext({deviceType:a,powerPreference:o})}else i.currentContext=await i.webnnCreateMLContext();break}a=await i._OrtCreateSession(n,r,o),i.webgpuOnCreateSession?.(a),a===0&&F(`Can't create a session.`),i.jsepOnCreateSession?.(),i.currentContext&&(i.webnnRegisterMLContext(a,i.currentContext),i.currentContext=void 0,i.shouldTransferToMLTensor=!0);let[e,d]=Iu(a),f=!!t?.enableGraphCapture,p=[],m=[],h=[],g=[],_=[];for(let t=0;t<e;t++){let[e,n,r]=Lu(a,t);e===0&&F(`Can't get an input name.`),l.push(e);let o=i.UTF8ToString(e);p.push(o),h.push(n===0?{name:o,isTensor:!1}:{name:o,isTensor:!0,type:St(n),shape:r})}for(let n=0;n<d;n++){let[r,o,s]=Lu(a,n+e);r===0&&F(`Can't get an output name.`),u.push(r);let c=i.UTF8ToString(r);m.push(c),g.push(o===0?{name:c,isTensor:!1}:{name:c,isTensor:!0,type:St(o),shape:s});{if(f&&t?.preferredOutputLocation===void 0){_.push(`gpu-buffer`);continue}let e=typeof t?.preferredOutputLocation==`string`?t.preferredOutputLocation:t?.preferredOutputLocation?.[c]??`cpu`,n=i.webnnIsGraphOutput;if(e===`cpu`&&n&&n(a,c)){_.push(`ml-tensor-cpu-output`);continue}if(e!==`cpu`&&e!==`cpu-pinned`&&e!==`gpu-buffer`&&e!==`ml-tensor`)throw Error(`Not supported preferred output location: ${e}.`);if(f&&e!==`gpu-buffer`)throw Error(`Not supported preferred output location: ${e}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);_.push(e)}}let v=null;return _.some(e=>e===`gpu-buffer`||e===`ml-tensor`||e===`ml-tensor-cpu-output`)&&(s=i._OrtCreateBinding(a),s===0&&F(`Can't create IO binding.`),v={handle:s,outputPreferredLocations:_,outputPreferredLocationsEncoded:_.map(e=>e===`ml-tensor-cpu-output`?`ml-tensor`:e).map(e=>Ot(e))}),Fu.set(a,[a,l,u,v,f,!1]),[a,p,m,h,g]}catch(e){throw l.forEach(e=>i._OrtFree(e)),u.forEach(e=>i._OrtFree(e)),s!==0&&i._OrtReleaseBinding(s)!==0&&F(`Can't release IO binding.`),a!==0&&i._OrtReleaseSession(a)!==0&&F(`Can't release session.`),e}finally{i._free(n),o!==0&&i._OrtReleaseSessionOptions(o)!==0&&F(`Can't release session options.`),c.forEach(e=>i._free(e)),i.unmountExternalData?.()}},Bu=e=>{let t=N(),n=Fu.get(e);if(!n)throw Error(`cannot release session. invalid session id: ${e}`);let[r,i,a,o,s]=n;o&&(s&&t._OrtClearBoundOutputs(o.handle)!==0&&F(`Can't clear bound outputs.`),t._OrtReleaseBinding(o.handle)!==0&&F(`Can't release IO binding.`)),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),i.forEach(e=>t._OrtFree(e)),a.forEach(e=>t._OrtFree(e)),t._OrtReleaseSession(r)!==0&&F(`Can't release session.`),Fu.delete(e)},Vu=async(e,t,n,r,i,a,o=!1)=>{if(!e){t.push(0);return}let s=N(),c=s.PTR_SIZE,l=e[0],u=e[1],d=e[3],f=d,p,m;if(l===`string`&&(d===`gpu-buffer`||d===`ml-tensor`))throw Error(`String tensor is not supported on GPU.`);if(o&&d!==`gpu-buffer`)throw Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(d===`gpu-buffer`){let t=e[2].gpuBuffer;m=Ct(xt(l),u);{let e=s.jsepRegisterBuffer;if(!e)throw Error(`Tensor location "gpu-buffer" is not supported without using WebGPU.`);p=e(r,a,t,m)}}else if(d===`ml-tensor`){let t=e[2].mlTensor;m=Ct(xt(l),u);let n=s.webnnRegisterMLTensor;if(!n)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);p=n(r,t,xt(l),u)}else{let t=e[2];if(Array.isArray(t)){m=c*t.length,p=s._malloc(m),n.push(p);for(let e=0;e<t.length;e++){if(typeof t[e]!=`string`)throw TypeError(`tensor data at index ${e} is not a string`);s.setValue(p+e*c,lt(t[e],n),`*`)}}else{let e=s.webnnIsGraphInput,a=s.webnnIsGraphOutput;if(l!==`string`&&e&&a){let o=s.UTF8ToString(i);if(e(r,o)||a(r,o)){let e=xt(l);m=Ct(e,u),f=`ml-tensor`;let n=s.webnnCreateTemporaryTensor,i=s.webnnUploadTensor;if(!n||!i)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);let a=await n(r,e,u);i(a,new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),p=a}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}}let h=s.stackSave(),g=s.stackAlloc(4*u.length);try{u.forEach((e,t)=>s.setValue(g+t*c,e,c===4?`i32`:`i64`));let e=s._OrtCreateTensor(xt(l),p,m,g,u.length,Ot(f));e===0&&F(`Can't create tensor for input/output. session=${r}, index=${a}.`),t.push(e)}finally{s.stackRestore(h)}},Hu=async(e,t,n,r,i,a)=>{let o=N(),s=o.PTR_SIZE,c=Fu.get(e);if(!c)throw Error(`cannot run inference. invalid session id: ${e}`);let l=c[0],u=c[1],d=c[2],f=c[3],p=c[4],m=c[5],h=t.length,g=r.length,_=0,v=[],y=[],b=[],x=[],S=[],C=o.stackSave(),w=o.stackAlloc(h*s),ee=o.stackAlloc(h*s),T=o.stackAlloc(g*s),E=o.stackAlloc(g*s);try{[_,v]=ft(a),k(`wasm prepareInputOutputTensor`);for(let r=0;r<h;r++)await Vu(n[r],y,x,e,u[t[r]],t[r],p);for(let t=0;t<g;t++)await Vu(i[t],b,x,e,d[r[t]],h+r[t],p);xe(`wasm prepareInputOutputTensor`);for(let e=0;e<h;e++)o.setValue(w+e*s,y[e],`*`),o.setValue(ee+e*s,u[t[e]],`*`);for(let e=0;e<g;e++)o.setValue(T+e*s,b[e],`*`),o.setValue(E+e*s,d[r[e]],`*`);if(f&&!m){let{handle:n,outputPreferredLocations:a,outputPreferredLocationsEncoded:s}=f;if(u.length!==h)throw Error(`input count from feeds (${h}) is expected to be always equal to model's input count (${u.length}).`);k(`wasm bindInputsOutputs`);for(let r=0;r<h;r++){let i=t[r];await o._OrtBindInput(n,u[i],y[r])!==0&&F(`Can't bind input[${r}] for session=${e}.`)}for(let t=0;t<g;t++){let c=r[t];i[t]?.[3]?(S.push(b[t]),o._OrtBindOutput(n,d[c],b[t],0)!==0&&F(`Can't bind pre-allocated output[${t}] for session=${e}.`)):o._OrtBindOutput(n,d[c],0,s[c])!==0&&F(`Can't bind output[${t}] to ${a[t]} for session=${e}.`)}xe(`wasm bindInputsOutputs`),Fu.set(e,[l,u,d,f,p,!0])}o.jsepOnRunStart?.(l),o.webnnOnRunStart?.(l);let c;c=f?await o._OrtRunWithBinding(l,f.handle,g,T,_):await o._OrtRun(l,ee,w,h,E,g,T,_),c!==0&&F(`failed to call OrtRun().`);let C=[],te=[];k(`wasm ProcessOutputTensor`);for(let t=0;t<g;t++){let n=Number(o.getValue(T+t*s,`*`));if(n===b[t]||S.includes(b[t])){C.push(i[t]),n!==b[t]&&o._OrtReleaseTensor(n)!==0&&F(`Can't release tensor.`);continue}let a=o.stackSave(),c=o.stackAlloc(4*s),l=!1,u,d=0;try{o._OrtGetTensorData(n,c,c+s,c+2*s,c+3*s)!==0&&F(`Can't access output tensor data on index ${t}.`);let i=s===4?`i32`:`i64`,a=Number(o.getValue(c,i));d=o.getValue(c+s,`*`);let p=o.getValue(c+s*2,`*`),m=Number(o.getValue(c+s*3,i)),h=[];for(let e=0;e<m;e++)h.push(Number(o.getValue(p+e*s,i)));o._OrtFree(p)!==0&&F(`Can't free memory for tensor dims.`);let g=h.reduce((e,t)=>e*t,1);u=St(a);let _=f?.outputPreferredLocations[r[t]];if(u===`string`){if(_===`gpu-buffer`||_===`ml-tensor`)throw Error(`String tensor is not supported on GPU.`);let e=[];for(let t=0;t<g;t++){let n=o.getValue(d+t*s,`*`),r=o.getValue(d+(t+1)*s,`*`),i=t===g-1?void 0:r-n;e.push(o.UTF8ToString(n,i))}C.push([u,h,e,`cpu`])}else if(_===`gpu-buffer`&&g>0){let e=o.jsepGetBuffer;if(!e)throw Error(`preferredLocation "gpu-buffer" is not supported without using WebGPU.`);let t=e(d),r=Ct(a,g);if(r===void 0||!Et(u))throw Error(`Unsupported data type: ${u}`);l=!0,C.push([u,h,{gpuBuffer:t,download:o.jsepCreateDownloader(t,r,u),dispose:()=>{o._OrtReleaseTensor(n)!==0&&F(`Can't release tensor.`)}},`gpu-buffer`])}else if(_===`ml-tensor`&&g>0){let t=o.webnnEnsureTensor,r=o.webnnIsGraphInputOutputTypeSupported;if(!t||!r)throw Error(`preferredLocation "ml-tensor" is not supported without using WebNN.`);if(Ct(a,g)===void 0||!Dt(u))throw Error(`Unsupported data type: ${u}`);if(!r(e,u,!1))throw Error(`preferredLocation "ml-tensor" for ${u} output is not supported by current WebNN Context.`);let i=await t(e,d,a,h,!1);l=!0,C.push([u,h,{mlTensor:i,download:o.webnnCreateMLTensorDownloader(d,u),dispose:()=>{o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n)}},`ml-tensor`])}else if(_===`ml-tensor-cpu-output`&&g>0){let e=o.webnnCreateMLTensorDownloader(d,u)(),t=C.length;l=!0,te.push((async()=>{let r=[t,await e];return o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n),r})()),C.push([u,h,[],`cpu`])}else{let e=new(wt(u))(g);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(o.HEAPU8.subarray(d,d+e.byteLength)),C.push([u,h,e,`cpu`])}}finally{o.stackRestore(a),u===`string`&&d&&o._free(d),l||o._OrtReleaseTensor(n)}}f&&!p&&(o._OrtClearBoundOutputs(f.handle)!==0&&F(`Can't clear bound outputs.`),Fu.set(e,[l,u,d,f,p,!1]));for(let[e,t]of await Promise.all(te))C[e][2]=t;return xe(`wasm ProcessOutputTensor`),C}finally{o.webnnOnRunEnd?.(l),o.stackRestore(C),y.forEach(e=>o._OrtReleaseTensor(e)),b.forEach(e=>o._OrtReleaseTensor(e)),x.forEach(e=>o._free(e)),_!==0&&o._OrtReleaseRunOptions(_),v.forEach(e=>o._free(e))}},Uu=e=>{let t=N(),n=Fu.get(e);if(!n)throw Error(`invalid session id`);let r=n[0],i=t._OrtEndProfiling(r);i===0&&F(`Can't get an profile file name.`),t._OrtFree(i)},Wu=e=>{let t=[];for(let n of e){let e=n[2];!Array.isArray(e)&&`buffer`in e&&t.push(e.buffer)}return t}}),Ku,qu,Ju,Yu,Xu,Zu,Qu,$u,ed,td,nd,rd,id,ad,od,sd,cd,ld,ud=o(()=>{je(),Gu(),P(),nt(),Ku=()=>!!S.wasm.proxy&&typeof document<`u`,Ju=!1,Yu=!1,Xu=!1,$u=new Map,ed=(e,t)=>{let n=$u.get(e);n?n.push(t):$u.set(e,[t])},td=()=>{if(Ju||!Yu||Xu||!qu)throw Error(`worker not ready`)},nd=e=>{switch(e.data.type){case`init-wasm`:Ju=!1,e.data.err?(Xu=!0,Qu[1](e.data.err)):(Yu=!0,Qu[0]()),Zu&&=(URL.revokeObjectURL(Zu),void 0);break;case`init-ep`:case`copy-from`:case`create`:case`release`:case`run`:case`end-profiling`:{let t=$u.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},rd=async()=>{if(!Yu){if(Ju)throw Error(`multiple calls to 'initWasm()' detected.`);if(Xu)throw Error(`previous call to 'initWasm()' failed.`);if(Ju=!0,Ku())return new Promise((e,t)=>{qu?.terminate(),et().then(([n,r])=>{try{qu=r,qu.onerror=e=>t(e),qu.onmessage=nd,Qu=[e,t];let i={type:`init-wasm`,in:S};!i.in.wasm.wasmPaths&&(n||We)&&(i.in.wasm.wasmPaths={wasm:new URL(`/ChessCoach/assets/ort-wasm-simd-threaded.jsep-CyqnNavA.wasm`,``+import.meta.url).href}),qu.postMessage(i),Zu=n}catch(e){t(e)}},t)});try{await ct(S.wasm),await Nu(S),Yu=!0}catch(e){throw Xu=!0,e}finally{Ju=!1}}},id=async e=>{if(Ku())return td(),new Promise((t,n)=>{ed(`init-ep`,[t,n]);let r={type:`init-ep`,in:{epName:e,env:S}};qu.postMessage(r)});await Pu(S,e)},ad=async e=>Ku()?(td(),new Promise((t,n)=>{ed(`copy-from`,[t,n]);let r={type:`copy-from`,in:{buffer:e}};qu.postMessage(r,[e.buffer])})):Ru(e),od=async(e,t)=>{if(Ku()){if(t?.preferredOutputLocation)throw Error(`session option "preferredOutputLocation" is not supported for proxy.`);return td(),new Promise((n,r)=>{ed(`create`,[n,r]);let i={type:`create`,in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),qu.postMessage(i,a)})}else return zu(e,t)},sd=async e=>{if(Ku())return td(),new Promise((t,n)=>{ed(`release`,[t,n]);let r={type:`release`,in:e};qu.postMessage(r)});Bu(e)},cd=async(e,t,n,r,i,a)=>{if(Ku()){if(n.some(e=>e[3]!==`cpu`))throw Error(`input tensor on GPU is not supported for proxy.`);if(i.some(e=>e))throw Error(`pre-allocated output tensor is not supported for proxy.`);return td(),new Promise((i,o)=>{ed(`run`,[i,o]);let s=n,c={type:`run`,in:{sessionId:e,inputIndices:t,inputs:s,outputIndices:r,options:a}};qu.postMessage(c,Wu(s))})}else return Hu(e,t,n,r,i,a)},ld=async e=>{if(Ku())return td(),new Promise((t,n)=>{ed(`end-profiling`,[t,n]);let r={type:`end-profiling`,in:e};qu.postMessage(r)});Uu(e)}}),dd,fd,pd,md=o(()=>{je(),ud(),I(),Me(),At(),dd=(e,t)=>{switch(e.location){case`cpu`:return[e.type,e.dims,e.data,`cpu`];case`gpu-buffer`:return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},`gpu-buffer`];case`ml-tensor`:return[e.type,e.dims,{mlTensor:e.mlTensor},`ml-tensor`];default:throw Error(`invalid data location: ${e.location} for ${t()}`)}},fd=e=>{switch(e[3]){case`cpu`:return new he(e[0],e[2],e[1]);case`gpu-buffer`:{let t=e[0];if(!Et(t))throw Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:r,dispose:i}=e[2];return he.fromGpuBuffer(n,{dataType:t,dims:e[1],download:r,dispose:i})}case`ml-tensor`:{let t=e[0];if(!Dt(t))throw Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:r,dispose:i}=e[2];return he.fromMLTensor(n,{dataType:t,dims:e[1],download:r,dispose:i})}default:throw Error(`invalid data location: ${e[3]}`)}},pd=class{async fetchModelAndCopyToWasmMemory(e){return ad(await kt(e))}async loadModel(e,t){ye();let n;n=typeof e==`string`?await this.fetchModelAndCopyToWasmMemory(e):e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await od(n,t),be()}async dispose(){return sd(this.sessionId)}async run(e,t,n){ye();let r=[],i=[];Object.entries(e).forEach(e=>{let t=e[0],n=e[1],a=this.inputNames.indexOf(t);if(a===-1)throw Error(`invalid input '${t}'`);r.push(n),i.push(a)});let a=[],o=[];Object.entries(t).forEach(e=>{let t=e[0],n=e[1],r=this.outputNames.indexOf(t);if(r===-1)throw Error(`invalid output '${t}'`);a.push(n),o.push(r)});let s=r.map((e,t)=>dd(e,()=>`input "${this.inputNames[i[t]]}"`)),c=a.map((e,t)=>e?dd(e,()=>`output "${this.outputNames[o[t]]}"`):null),l=await cd(this.sessionId,i,s,o,c,n),u={};for(let e=0;e<l.length;e++)u[this.outputNames[o[e]]]=a[e]??fd(l[e]);return be(),u}startProfiling(){}endProfiling(){ld(this.sessionId)}}}),hd={};s(hd,{OnnxruntimeWebAssemblyBackend:()=>_d,initializeFlags:()=>gd,wasmBackend:()=>vd});var gd,_d,vd,yd=o(()=>{je(),ud(),md(),gd=()=>{(typeof S.wasm.initTimeout!=`number`||S.wasm.initTimeout<0)&&(S.wasm.initTimeout=0);let e=S.wasm.simd;if(typeof e!=`boolean`&&e!==void 0&&e!==`fixed`&&e!==`relaxed`&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),S.wasm.simd=!1),typeof S.wasm.proxy!=`boolean`&&(S.wasm.proxy=!1),typeof S.wasm.trace!=`boolean`&&(S.wasm.trace=!1),typeof S.wasm.numThreads!=`number`||!Number.isInteger(S.wasm.numThreads)||S.wasm.numThreads<=0)if(typeof self<`u`&&!self.crossOriginIsolated)S.wasm.numThreads=1;else{let e=typeof navigator>`u`?a(`node:os`).cpus().length:navigator.hardwareConcurrency;S.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},_d=class{async init(e){gd(),await rd(),await id(e)}async createInferenceSessionHandler(e,t){let n=new pd;return await n.loadModel(e,t),n}},vd=new _d});je(),je(),je();var bd=`1.26.0`;{let e=(yd(),l(hd)).wasmBackend;f(`webgpu`,e,5),f(`webnn`,e,5),f(`cpu`,e,10),f(`wasm`,e,10)}Object.defineProperty(S.versions,`web`,{value:bd,enumerable:!0});
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2020 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
function xd(e){return e===null?{variations:[]}:{comment:e,variations:[]}}function Sd(e,t,n,r,i){let a={move:e,variations:i};return t&&(a.suffix=t),n&&(a.nag=n),r!==null&&(a.comment=r),a}function Cd(...e){let[t,...n]=e,r=t;for(let e of n)e!==null&&(r.variations=[e,...e.variations],e.variations=[],r=e);return t}function wd(e,t){if(t.marker&&t.marker.comment){let e=t.root;for(;;){let n=e.variations[0];if(!n){e.comment=t.marker.comment;break}e=n}}return{headers:e,root:t.root,result:(t.marker&&t.marker.result)??void 0}}function Td(e,t){function n(){this.constructor=e}n.prototype=t.prototype,e.prototype=new n}function Ed(e,t,n,r){var i=Error.call(this,e);return Object.setPrototypeOf&&Object.setPrototypeOf(i,Ed.prototype),i.expected=t,i.found=n,i.location=r,i.name=`SyntaxError`,i}Td(Ed,Error);function Dd(e,t,n){return n||=` `,e.length>t?e:(t-=e.length,n+=n.repeat(t),e+n.slice(0,t))}Ed.prototype.format=function(e){var t=`Error: `+this.message;if(this.location){var n=null,r;for(r=0;r<e.length;r++)if(e[r].source===this.location.source){n=e[r].text.split(/\r\n|\n|\r/g);break}var i=this.location.start,a=this.location.source&&typeof this.location.source.offset==`function`?this.location.source.offset(i):i,o=this.location.source+`:`+a.line+`:`+a.column;if(n){var s=this.location.end,c=Dd(``,a.line.toString().length,` `),l=n[i.line-1],u=(i.line===s.line?s.column:l.length+1)-i.column||1;t+=`
 --> `+o+`
`+c+` |
`+a.line+` | `+l+`
`+c+` | `+Dd(``,i.column-1,` `)+Dd(``,u,`^`)}else t+=`
 at `+o}return t},Ed.buildMessage=function(e,t){var n={literal:function(e){return`"`+i(e.text)+`"`},class:function(e){var t=e.parts.map(function(e){return Array.isArray(e)?a(e[0])+`-`+a(e[1]):a(e)});return`[`+(e.inverted?`^`:``)+t.join(``)+`]`},any:function(){return`any character`},end:function(){return`end of input`},other:function(e){return e.description}};function r(e){return e.charCodeAt(0).toString(16).toUpperCase()}function i(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function a(e){return e.replace(/\\/g,`\\\\`).replace(/\]/g,`\\]`).replace(/\^/g,`\\^`).replace(/-/g,`\\-`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function o(e){return n[e.type](e)}function s(e){var t=e.map(o),n,r;if(t.sort(),t.length>0){for(n=1,r=1;n<t.length;n++)t[n-1]!==t[n]&&(t[r]=t[n],r++);t.length=r}switch(t.length){case 1:return t[0];case 2:return t[0]+` or `+t[1];default:return t.slice(0,-1).join(`, `)+`, or `+t[t.length-1]}}function c(e){return e?`"`+i(e)+`"`:`end of input`}return`Expected `+s(e)+` but `+c(t)+` found.`};function Od(e,t){t=t===void 0?{}:t;var n={},r=t.grammarSource,i={pgn:ut},a=ut,o=`[`,s=`"`,c=`]`,l=`.`,u=`O-O-O`,d=`O-O`,f=`0-0-0`,p=`0-0`,m=`$`,h=`{`,g=`}`,_=`;`,v=`(`,y=`)`,b=`1-0`,x=`0-1`,S=`1/2-1/2`,C=`*`,w=/^[a-zA-Z]/,ee=/^[^"]/,T=/^[0-9]/,E=/^[.]/,te=/^[a-zA-Z1-8\-=]/,ne=/^[+#]/,D=/^[!?]/,O=/^[^}]/,re=/^[^\r\n]/,ie=/^[ \t\r\n]/,ae=st(`tag pair`),oe=M(`[`,!1),se=M(`"`,!1),ce=M(`]`,!1),le=st(`tag name`),ue=at([[`a`,`z`],[`A`,`Z`]],!1,!1),de=st(`tag value`),fe=at([`"`],!0,!1),pe=st(`move number`),me=at([[`0`,`9`]],!1,!1),he=M(`.`,!1),ge=at([`.`],!1,!1),_e=st(`standard algebraic notation`),ve=M(`O-O-O`,!1),ye=M(`O-O`,!1),be=M(`0-0-0`,!1),k=M(`0-0`,!1),xe=at([[`a`,`z`],[`A`,`Z`],[`1`,`8`],`-`,`=`],!1,!1),Se=at([`+`,`#`],!1,!1),Ce=st(`suffix annotation`),we=at([`!`,`?`],!1,!1),Te=st(`NAG`),Ee=M(`$`,!1),De=st(`brace comment`),Oe=M(`{`,!1),ke=at([`}`],!0,!1),Ae=M(`}`,!1),je=st(`rest of line comment`),Me=M(`;`,!1),Ne=at([`\r`,`
`],!0,!1),Pe=st(`variation`),Fe=M(`(`,!1),Ie=M(`)`,!1),Le=st(`game termination marker`),Re=M(`1-0`,!1),ze=M(`0-1`,!1),Be=M(`1/2-1/2`,!1),Ve=M(`*`,!1),He=st(`whitespace`),Ue=at([` `,`	`,`\r`,`
`],!1,!1),We=function(e,t){return wd(e,t)},Ge=function(e){return Object.fromEntries(e)},Ke=function(e,t){return[e,t]},qe=function(e,t){return{root:e,marker:t}},Je=function(e,t){return Cd(xd(e),...t.flat())},Ye=function(e,t,n,r,i){return Sd(e,t,n,r,i)},Xe=function(e){return e},Ze=function(e){return e.replace(/[\r\n]+/g,` `)},Qe=function(e){return e.trim()},$e=function(e){return e},et=function(e,t){return{result:e,comment:t}},A=t.peg$currPos|0,tt=[{line:1,column:1}],nt=A,rt=t.peg$maxFailExpected||[],j=t.peg$silentFails|0,it;if(t.startRule){if(!(t.startRule in i))throw Error(`Can't start parsing from rule "`+t.startRule+`".`);a=i[t.startRule]}function M(e,t){return{type:`literal`,text:e,ignoreCase:t}}function at(e,t,n){return{type:`class`,parts:e,inverted:t,ignoreCase:n}}function ot(){return{type:`end`}}function st(e){return{type:`other`,description:e}}function ct(t){var n=tt[t],r;if(n)return n;if(t>=tt.length)r=tt.length-1;else for(r=t;!tt[--r];);for(n=tt[r],n={line:n.line,column:n.column};r<t;)e.charCodeAt(r)===10?(n.line++,n.column=1):n.column++,r++;return tt[t]=n,n}function N(e,t,n){var i=ct(e),a=ct(t);return{source:r,start:{offset:e,line:i.line,column:i.column},end:{offset:t,line:a.line,column:a.column}}}function P(e){A<nt||(A>nt&&(nt=A,rt=[]),rt.push(e))}function lt(e,t,n){return new Ed(Ed.buildMessage(e,t),e,t,n)}function ut(){var e=A;return e=We(F(),mt()),e}function F(){for(var e=A,t=[],r=dt();r!==n;)t.push(r),r=dt();return r=Et(),e=Ge(t),e}function dt(){var t,r,i,a,l,u,d;return j++,t=A,Et(),e.charCodeAt(A)===91?(r=o,A++):(r=n,j===0&&P(oe)),r===n?(A=t,t=n):(Et(),i=ft(),i===n?(A=t,t=n):(Et(),e.charCodeAt(A)===34?(a=s,A++):(a=n,j===0&&P(se)),a===n?(A=t,t=n):(l=pt(),e.charCodeAt(A)===34?(u=s,A++):(u=n,j===0&&P(se)),u===n?(A=t,t=n):(Et(),e.charCodeAt(A)===93?(d=c,A++):(d=n,j===0&&P(ce)),d===n?(A=t,t=n):t=Ke(i,l))))),j--,t===n&&j===0&&P(ae),t}function ft(){var t,r,i;if(j++,t=A,r=[],i=e.charAt(A),w.test(i)?A++:(i=n,j===0&&P(ue)),i!==n)for(;i!==n;)r.push(i),i=e.charAt(A),w.test(i)?A++:(i=n,j===0&&P(ue));else r=n;return t=r===n?r:e.substring(t,A),j--,t===n&&(r=n,j===0&&P(le)),t}function pt(){var t,r,i;for(j++,t=A,r=[],i=e.charAt(A),ee.test(i)?A++:(i=n,j===0&&P(fe));i!==n;)r.push(i),i=e.charAt(A),ee.test(i)?A++:(i=n,j===0&&P(fe));return t=e.substring(t,A),j--,r=n,j===0&&P(de),t}function mt(){var e=A,t=ht(),r;return Et(),r=Tt(),r===n&&(r=null),Et(),e=qe(t,r),e}function ht(){var e=A,t=xt(),r,i;for(t===n&&(t=null),r=[],i=gt();i!==n;)r.push(i),i=gt();return e=Je(t,r),e}function gt(){var e=A,t,r,i,a,o,s,c;if(Et(),_t(),Et(),t=vt(),t!==n){for(r=yt(),r===n&&(r=null),i=[],a=bt();a!==n;)i.push(a),a=bt();for(a=Et(),o=xt(),o===n&&(o=null),s=[],c=wt();c!==n;)s.push(c),c=wt();e=Ye(t,r,i,o,s)}else A=e,e=n;return e}function _t(){var t,r,i,a,o,s;for(j++,t=A,r=[],i=e.charAt(A),T.test(i)?A++:(i=n,j===0&&P(me));i!==n;)r.push(i),i=e.charAt(A),T.test(i)?A++:(i=n,j===0&&P(me));if(e.charCodeAt(A)===46?(i=l,A++):(i=n,j===0&&P(he)),i!==n){for(a=Et(),o=[],s=e.charAt(A),E.test(s)?A++:(s=n,j===0&&P(ge));s!==n;)o.push(s),s=e.charAt(A),E.test(s)?A++:(s=n,j===0&&P(ge));r=[r,i,a,o],t=r}else A=t,t=n;return j--,t===n&&(r=n,j===0&&P(pe)),t}function vt(){var t,r,i,a,o,s;if(j++,t=A,r=A,e.substr(A,5)===u?(i=u,A+=5):(i=n,j===0&&P(ve)),i===n&&(e.substr(A,3)===d?(i=d,A+=3):(i=n,j===0&&P(ye)),i===n&&(e.substr(A,5)===f?(i=f,A+=5):(i=n,j===0&&P(be)),i===n&&(e.substr(A,3)===p?(i=p,A+=3):(i=n,j===0&&P(k)),i===n))))if(i=A,a=e.charAt(A),w.test(a)?A++:(a=n,j===0&&P(ue)),a!==n){if(o=[],s=e.charAt(A),te.test(s)?A++:(s=n,j===0&&P(xe)),s!==n)for(;s!==n;)o.push(s),s=e.charAt(A),te.test(s)?A++:(s=n,j===0&&P(xe));else o=n;o===n?(A=i,i=n):(a=[a,o],i=a)}else A=i,i=n;return i===n?(A=r,r=n):(a=e.charAt(A),ne.test(a)?A++:(a=n,j===0&&P(Se)),a===n&&(a=null),i=[i,a],r=i),t=r===n?r:e.substring(t,A),j--,t===n&&(r=n,j===0&&P(_e)),t}function yt(){var t,r,i;for(j++,t=A,r=[],i=e.charAt(A),D.test(i)?A++:(i=n,j===0&&P(we));i!==n;)r.push(i),r.length>=2?i=n:(i=e.charAt(A),D.test(i)?A++:(i=n,j===0&&P(we)));return r.length<1?(A=t,t=n):t=r,j--,t===n&&(r=n,j===0&&P(Ce)),t}function bt(){var t,r,i,a,o;if(j++,t=A,Et(),e.charCodeAt(A)===36?(r=m,A++):(r=n,j===0&&P(Ee)),r!==n){if(i=A,a=[],o=e.charAt(A),T.test(o)?A++:(o=n,j===0&&P(me)),o!==n)for(;o!==n;)a.push(o),o=e.charAt(A),T.test(o)?A++:(o=n,j===0&&P(me));else a=n;i=a===n?a:e.substring(i,A),i===n?(A=t,t=n):t=Xe(i)}else A=t,t=n;return j--,t===n&&j===0&&P(Te),t}function xt(){var e=St();return e===n&&(e=Ct()),e}function St(){var t,r,i,a,o;if(j++,t=A,e.charCodeAt(A)===123?(r=h,A++):(r=n,j===0&&P(Oe)),r!==n){for(i=A,a=[],o=e.charAt(A),O.test(o)?A++:(o=n,j===0&&P(ke));o!==n;)a.push(o),o=e.charAt(A),O.test(o)?A++:(o=n,j===0&&P(ke));i=e.substring(i,A),e.charCodeAt(A)===125?(a=g,A++):(a=n,j===0&&P(Ae)),a===n?(A=t,t=n):t=Ze(i)}else A=t,t=n;return j--,t===n&&(r=n,j===0&&P(De)),t}function Ct(){var t,r,i,a,o;if(j++,t=A,e.charCodeAt(A)===59?(r=_,A++):(r=n,j===0&&P(Me)),r!==n){for(i=A,a=[],o=e.charAt(A),re.test(o)?A++:(o=n,j===0&&P(Ne));o!==n;)a.push(o),o=e.charAt(A),re.test(o)?A++:(o=n,j===0&&P(Ne));i=e.substring(i,A),t=Qe(i)}else A=t,t=n;return j--,t===n&&(r=n,j===0&&P(je)),t}function wt(){var t,r,i,a;return j++,t=A,Et(),e.charCodeAt(A)===40?(r=v,A++):(r=n,j===0&&P(Fe)),r===n?(A=t,t=n):(i=ht(),i===n?(A=t,t=n):(Et(),e.charCodeAt(A)===41?(a=y,A++):(a=n,j===0&&P(Ie)),a===n?(A=t,t=n):t=$e(i))),j--,t===n&&j===0&&P(Pe),t}function Tt(){var t,r,i;return j++,t=A,e.substr(A,3)===b?(r=b,A+=3):(r=n,j===0&&P(Re)),r===n&&(e.substr(A,3)===x?(r=x,A+=3):(r=n,j===0&&P(ze)),r===n&&(e.substr(A,7)===S?(r=S,A+=7):(r=n,j===0&&P(Be)),r===n&&(e.charCodeAt(A)===42?(r=C,A++):(r=n,j===0&&P(Ve))))),r===n?(A=t,t=n):(Et(),i=xt(),i===n&&(i=null),t=et(r,i)),j--,t===n&&(r=n,j===0&&P(Le)),t}function Et(){var t,r;for(j++,t=[],r=e.charAt(A),ie.test(r)?A++:(r=n,j===0&&P(Ue));r!==n;)t.push(r),r=e.charAt(A),ie.test(r)?A++:(r=n,j===0&&P(Ue));return j--,r=n,j===0&&P(He),t}if(it=a(),t.peg$library)return{peg$result:it,peg$currPos:A,peg$FAILED:n,peg$maxFailExpected:rt,peg$maxFailPos:nt};if(it!==n&&A===e.length)return it;throw it!==n&&A<e.length&&P(ot()),lt(rt,nt<e.length?e.charAt(nt):null,nt<e.length?N(nt,nt+1):N(nt,nt))}
/**
* @license
* Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
*    this list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the documentation
*    and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/
const kd=18446744073709551615n;function Ad(e,t){return(e<<t|e>>64n-t)&18446744073709551615n}function jd(e,t){return e*t&kd}function Md(e){return function(){let t=BigInt(e&kd),n=BigInt(e>>64n&kd),r=jd(Ad(jd(t,5n),7n),9n);return n^=t,t=(Ad(t,24n)^n^n<<16n)&kd,n=Ad(n,37n),e=n<<64n|t,r}}const Nd=Md(214711438343225530594246349426526445598n),Pd=Array.from({length:2},()=>Array.from({length:6},()=>Array.from({length:128},()=>Nd()))),Fd=Array.from({length:8},()=>Nd()),Id=Array.from({length:16},()=>Nd()),Ld=Nd(),Rd=`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;var zd=class{color;from;to;piece;captured;promotion;flags;san;lan;before;after;constructor(e,t){let{color:n,piece:r,from:i,to:a,flags:o,captured:s,promotion:c}=t,l=nf(i),u=nf(a);this.color=n,this.piece=r,this.from=l,this.to=u,this.san=e._moveToSan(t,e._moves({legal:!0})),this.lan=l+u,this.before=e.fen(),e._makeMove(t),this.after=e.fen(),e._undoMove(),this.flags=``;for(let e in Q)Q[e]&o&&(this.flags+=Bd[e]);s&&(this.captured=s),c&&(this.promotion=c,this.lan+=c)}isCapture(){return this.flags.indexOf(Bd.CAPTURE)>-1}isPromotion(){return this.flags.indexOf(Bd.PROMOTION)>-1}isEnPassant(){return this.flags.indexOf(Bd.EP_CAPTURE)>-1}isKingsideCastle(){return this.flags.indexOf(Bd.KSIDE_CASTLE)>-1}isQueensideCastle(){return this.flags.indexOf(Bd.QSIDE_CASTLE)>-1}isBigPawn(){return this.flags.indexOf(Bd.BIG_PAWN)>-1}};const Bd={NORMAL:`n`,CAPTURE:`c`,BIG_PAWN:`b`,EP_CAPTURE:`e`,PROMOTION:`p`,KSIDE_CASTLE:`k`,QSIDE_CASTLE:`q`,NULL_MOVE:`-`},Q={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64,NULL_MOVE:128},Vd={Event:`?`,Site:`?`,Date:`????.??.??`,Round:`?`,White:`?`,Black:`?`,Result:`*`},Hd={WhiteTitle:null,BlackTitle:null,WhiteElo:null,BlackElo:null,WhiteUSCF:null,BlackUSCF:null,WhiteNA:null,BlackNA:null,WhiteType:null,BlackType:null,EventDate:null,EventSponsor:null,Section:null,Stage:null,Board:null,Opening:null,Variation:null,SubVariation:null,ECO:null,NIC:null,Time:null,UTCTime:null,UTCDate:null,TimeControl:null,SetUp:null,FEN:null,Termination:null,Annotator:null,Mode:null,PlyCount:null},Ud={...Vd,...Hd},$={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},Wd={b:[16,32,17,15],w:[-16,-32,-17,-15]},Gd={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},Kd=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],qd=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],Jd={p:1,n:2,b:4,r:8,q:16,k:32},Yd=[`n`,`b`,`r`,`q`],Xd={k:Q.KSIDE_CASTLE,q:Q.QSIDE_CASTLE},Zd={w:[{square:$.a1,flag:Q.QSIDE_CASTLE},{square:$.h1,flag:Q.KSIDE_CASTLE}],b:[{square:$.a8,flag:Q.QSIDE_CASTLE},{square:$.h8,flag:Q.KSIDE_CASTLE}]},Qd={b:1,w:6};function $d(e){return e>>4}function ef(e){return e&15}function tf(e){return`0123456789`.indexOf(e)!==-1}function nf(e){let t=ef(e),n=$d(e);return`abcdefgh`.substring(t,t+1)+`87654321`.substring(n,n+1)}function rf(e){return e===`w`?`b`:`w`}function af(e){let t=e.split(/\s+/);if(t.length!==6)return{ok:!1,error:`Invalid FEN: must contain six space-delimited fields`};let n=parseInt(t[5],10);if(isNaN(n)||n<=0)return{ok:!1,error:`Invalid FEN: move number must be a positive integer`};let r=parseInt(t[4],10);if(isNaN(r)||r<0)return{ok:!1,error:`Invalid FEN: half move counter number must be a non-negative integer`};if(!/^(-|[abcdefgh][36])$/.test(t[3]))return{ok:!1,error:`Invalid FEN: en-passant square is invalid`};if(/[^kKqQ-]/.test(t[2]))return{ok:!1,error:`Invalid FEN: castling availability is invalid`};if(!/^(w|b)$/.test(t[1]))return{ok:!1,error:`Invalid FEN: side-to-move is invalid`};let i=t[0].split(`/`);if(i.length!==8)return{ok:!1,error:`Invalid FEN: piece data does not contain 8 '/'-delimited rows`};for(let e=0;e<i.length;e++){let t=0,n=!1;for(let r=0;r<i[e].length;r++)if(tf(i[e][r])){if(n)return{ok:!1,error:`Invalid FEN: piece data is invalid (consecutive number)`};t+=parseInt(i[e][r],10),n=!0}else{if(!/^[prnbqkPRNBQK]$/.test(i[e][r]))return{ok:!1,error:`Invalid FEN: piece data is invalid (invalid piece)`};t+=1,n=!1}if(t!==8)return{ok:!1,error:`Invalid FEN: piece data is invalid (too many squares in rank)`}}if(t[3][1]==`3`&&t[1]==`w`||t[3][1]==`6`&&t[1]==`b`)return{ok:!1,error:`Invalid FEN: illegal en-passant square`};for(let{color:e,regex:n}of[{color:`white`,regex:/K/g},{color:`black`,regex:/k/g}]){if(!n.test(t[0]))return{ok:!1,error:`Invalid FEN: missing ${e} king`};if((t[0].match(n)||[]).length>1)return{ok:!1,error:`Invalid FEN: too many ${e} kings`}}return Array.from(i[0]+i[7]).some(e=>e.toUpperCase()===`P`)?{ok:!1,error:`Invalid FEN: some pawns are on the edge rows`}:{ok:!0}}function of(e,t){let n=e.from,r=e.to,i=e.piece,a=0,o=0,s=0;for(let e=0,c=t.length;e<c;e++){let c=t[e].from,l=t[e].to;i===t[e].piece&&n!==c&&r===l&&(a++,$d(n)===$d(c)&&o++,ef(n)===ef(c)&&s++)}return a>0?o>0&&s>0?nf(n):s>0?nf(n).charAt(1):nf(n).charAt(0):``}function sf(e,t,n,r,i,a=void 0,o=Q.NORMAL){let s=$d(r);if(i===`p`&&(s===7||s===0))for(let s=0;s<Yd.length;s++){let c=Yd[s];e.push({color:t,from:n,to:r,piece:i,captured:a,promotion:c,flags:o|Q.PROMOTION})}else e.push({color:t,from:n,to:r,piece:i,captured:a,flags:o})}function cf(e){let t=e.charAt(0);return t>=`a`&&t<=`h`?e.match(/[a-h]\d.*[a-h]\d/)?void 0:`p`:(t=t.toLowerCase(),t===`o`?`k`:t)}function lf(e){return e.replace(/=/,``).replace(/[+#]?[?!]*$/,``)}var uf=class{_board=Array(128);_turn=`w`;_header={};_kings={w:-1,b:-1};_epSquare=-1;_halfMoves=0;_moveNumber=0;_history=[];_comments={};_castling={w:0,b:0};_hash=0n;_positionCount=new Map;constructor(e=Rd,{skipValidation:t=!1}={}){this.load(e,{skipValidation:t})}clear({preserveHeaders:e=!1}={}){this._board=Array(128),this._kings={w:-1,b:-1},this._turn=`w`,this._castling={w:0,b:0},this._epSquare=-1,this._halfMoves=0,this._moveNumber=1,this._history=[],this._comments={},this._header=e?this._header:{...Ud},this._hash=this._computeHash(),this._positionCount=new Map,this._header.SetUp=null,this._header.FEN=null}load(e,{skipValidation:t=!1,preserveHeaders:n=!1}={}){let r=e.split(/\s+/);if(r.length>=2&&r.length<6&&(e=r.concat([`-`,`-`,`0`,`1`].slice(-(6-r.length))).join(` `)),r=e.split(/\s+/),!t){let{ok:t,error:n}=af(e);if(!t)throw Error(n)}let i=r[0],a=0;this.clear({preserveHeaders:n});for(let e=0;e<i.length;e++){let t=i.charAt(e);if(t===`/`)a+=8;else if(tf(t))a+=parseInt(t,10);else{let e=t<`a`?`w`:`b`;this._put({type:t.toLowerCase(),color:e},nf(a)),a++}}this._turn=r[1],r[2].indexOf(`K`)>-1&&(this._castling.w|=Q.KSIDE_CASTLE),r[2].indexOf(`Q`)>-1&&(this._castling.w|=Q.QSIDE_CASTLE),r[2].indexOf(`k`)>-1&&(this._castling.b|=Q.KSIDE_CASTLE),r[2].indexOf(`q`)>-1&&(this._castling.b|=Q.QSIDE_CASTLE),this._epSquare=r[3]===`-`?-1:$[r[3]],this._halfMoves=parseInt(r[4],10),this._moveNumber=parseInt(r[5],10),this._hash=this._computeHash(),this._updateSetup(e),this._incPositionCount()}fen({forceEnpassantSquare:e=!1}={}){let t=0,n=``;for(let e=$.a8;e<=$.h1;e++){if(this._board[e]){t>0&&(n+=t,t=0);let{color:r,type:i}=this._board[e];n+=r===`w`?i.toUpperCase():i.toLowerCase()}else t++;e+1&136&&(t>0&&(n+=t),e!==$.h1&&(n+=`/`),t=0,e+=8)}let r=``;this._castling.w&Q.KSIDE_CASTLE&&(r+=`K`),this._castling.w&Q.QSIDE_CASTLE&&(r+=`Q`),this._castling.b&Q.KSIDE_CASTLE&&(r+=`k`),this._castling.b&Q.QSIDE_CASTLE&&(r+=`q`),r||=`-`;let i=`-`;if(this._epSquare!==-1)if(e)i=nf(this._epSquare);else{let e=this._epSquare+(this._turn===`w`?16:-16),t=[e+1,e-1];for(let e of t){if(e&136)continue;let t=this._turn;if(this._board[e]?.color===t&&this._board[e]?.type===`p`){this._makeMove({color:t,from:e,to:this._epSquare,piece:`p`,captured:`p`,flags:Q.EP_CAPTURE});let n=!this._isKingAttacked(t);if(this._undoMove(),n){i=nf(this._epSquare);break}}}}return[n,this._turn,r,i,this._halfMoves,this._moveNumber].join(` `)}_pieceKey(e){if(!this._board[e])return 0n;let{color:t,type:n}=this._board[e],r={w:0,b:1}[t],i={p:0,n:1,b:2,r:3,q:4,k:5}[n];return Pd[r][i][e]}_epKey(){return this._epSquare===-1?0n:Fd[this._epSquare&7]}_castlingKey(){return Id[this._castling.w>>5|this._castling.b>>3]}_computeHash(){let e=0n;for(let t=$.a8;t<=$.h1;t++){if(t&136){t+=7;continue}this._board[t]&&(e^=this._pieceKey(t))}return e^=this._epKey(),e^=this._castlingKey(),this._turn===`b`&&(e^=Ld),e}_updateSetup(e){this._history.length>0||(e===`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`?(this._header.SetUp=null,this._header.FEN=null):(this._header.SetUp=`1`,this._header.FEN=e))}reset(){this.load(Rd)}get(e){return this._board[$[e]]}findPiece(e){let t=[];for(let n=$.a8;n<=$.h1;n++){if(n&136){n+=7;continue}!this._board[n]||this._board[n]?.color!==e.color||this._board[n].color===e.color&&this._board[n].type===e.type&&t.push(nf(n))}return t}put({type:e,color:t},n){return this._put({type:e,color:t},n)?(this._updateCastlingRights(),this._updateEnPassantSquare(),this._updateSetup(this.fen()),!0):!1}_set(e,t){this._hash^=this._pieceKey(e),this._board[e]=t,this._hash^=this._pieceKey(e)}_put({type:e,color:t},n){if(`pnbrqkPNBRQK`.indexOf(e.toLowerCase())===-1||!(n in $))return!1;let r=$[n];if(e==`k`&&!(this._kings[t]==-1||this._kings[t]==r))return!1;let i=this._board[r];return i&&i.type===`k`&&(this._kings[i.color]=-1),this._set(r,{type:e,color:t}),e===`k`&&(this._kings[t]=r),!0}_clear(e){this._hash^=this._pieceKey(e),delete this._board[e]}remove(e){let t=this.get(e);return this._clear($[e]),t&&t.type===`k`&&(this._kings[t.color]=-1),this._updateCastlingRights(),this._updateEnPassantSquare(),this._updateSetup(this.fen()),t}_updateCastlingRights(){this._hash^=this._castlingKey();let e=this._board[$.e1]?.type===`k`&&this._board[$.e1]?.color===`w`,t=this._board[$.e8]?.type===`k`&&this._board[$.e8]?.color===`b`;(!e||this._board[$.a1]?.type!==`r`||this._board[$.a1]?.color!==`w`)&&(this._castling.w&=-65),(!e||this._board[$.h1]?.type!==`r`||this._board[$.h1]?.color!==`w`)&&(this._castling.w&=-33),(!t||this._board[$.a8]?.type!==`r`||this._board[$.a8]?.color!==`b`)&&(this._castling.b&=-65),(!t||this._board[$.h8]?.type!==`r`||this._board[$.h8]?.color!==`b`)&&(this._castling.b&=-33),this._hash^=this._castlingKey()}_updateEnPassantSquare(){if(this._epSquare===-1)return;let e=this._epSquare+(this._turn===`w`?-16:16),t=this._epSquare+(this._turn===`w`?16:-16),n=[t+1,t-1];if(this._board[e]!==null||this._board[this._epSquare]!==null||this._board[t]?.color!==rf(this._turn)||this._board[t]?.type!==`p`){this._hash^=this._epKey(),this._epSquare=-1;return}n.some(e=>!(e&136)&&this._board[e]?.color===this._turn&&this._board[e]?.type===`p`)||(this._hash^=this._epKey(),this._epSquare=-1)}_attacked(e,t,n){let r=[];for(let i=$.a8;i<=$.h1;i++){if(i&136){i+=7;continue}if(this._board[i]===void 0||this._board[i].color!==e)continue;let a=this._board[i],o=i-t;if(o===0)continue;let s=o+119;if(Kd[s]&Jd[a.type]){if(a.type===`p`){if(o>0&&a.color===`w`||o<=0&&a.color===`b`)if(n)r.push(nf(i));else return!0;continue}if(a.type===`n`||a.type===`k`)if(n){r.push(nf(i));continue}else return!0;let e=qd[s],c=i+e,l=!1;for(;c!==t;){if(this._board[c]!=null){l=!0;break}c+=e}if(!l)if(n){r.push(nf(i));continue}else return!0}}return n?r:!1}attackers(e,t){return t?this._attacked(t,$[e],!0):this._attacked(this._turn,$[e],!0)}_isKingAttacked(e){let t=this._kings[e];return t===-1?!1:this._attacked(rf(e),t)}hash(){return this._hash.toString(16)}isAttacked(e,t){return this._attacked(t,$[e])}isCheck(){return this._isKingAttacked(this._turn)}inCheck(){return this.isCheck()}isCheckmate(){return this.isCheck()&&this._moves().length===0}isStalemate(){return!this.isCheck()&&this._moves().length===0}isInsufficientMaterial(){let e={b:0,n:0,r:0,q:0,k:0,p:0},t=[],n=0,r=0;for(let i=$.a8;i<=$.h1;i++){if(r=(r+1)%2,i&136){i+=7;continue}let a=this._board[i];a&&(e[a.type]=a.type in e?e[a.type]+1:1,a.type===`b`&&t.push(r),n++)}if(n===2||n===3&&(e.b===1||e.n===1))return!0;if(n===e.b+2){let e=0,n=t.length;for(let r=0;r<n;r++)e+=t[r];if(e===0||e===n)return!0}return!1}isThreefoldRepetition(){return this._getPositionCount(this._hash)>=3}isDrawByFiftyMoves(){return this._halfMoves>=100}isDraw(){return this.isDrawByFiftyMoves()||this.isStalemate()||this.isInsufficientMaterial()||this.isThreefoldRepetition()}isGameOver(){return this.isCheckmate()||this.isDraw()}moves({verbose:e=!1,square:t=void 0,piece:n=void 0}={}){let r=this._moves({square:t,piece:n});return e?r.map(e=>new zd(this,e)):r.map(e=>this._moveToSan(e,r))}_moves({legal:e=!0,piece:t=void 0,square:n=void 0}={}){let r=n?n.toLowerCase():void 0,i=t?.toLowerCase(),a=[],o=this._turn,s=rf(o),c=$.a8,l=$.h1,u=!1;if(r)if(r in $)c=l=$[r],u=!0;else return[];for(let e=c;e<=l;e++){if(e&136){e+=7;continue}if(!this._board[e]||this._board[e].color===s)continue;let{type:t}=this._board[e],n;if(t===`p`){if(i&&i!==t)continue;n=e+Wd[o][0],this._board[n]||(sf(a,o,e,n,`p`),n=e+Wd[o][1],Qd[o]===$d(e)&&!this._board[n]&&sf(a,o,e,n,`p`,void 0,Q.BIG_PAWN));for(let t=2;t<4;t++)n=e+Wd[o][t],!(n&136)&&(this._board[n]?.color===s?sf(a,o,e,n,`p`,this._board[n].type,Q.CAPTURE):n===this._epSquare&&sf(a,o,e,n,`p`,`p`,Q.EP_CAPTURE))}else{if(i&&i!==t)continue;for(let r=0,i=Gd[t].length;r<i;r++){let i=Gd[t][r];for(n=e;n+=i,!(n&136);){if(!this._board[n])sf(a,o,e,n,t);else{if(this._board[n].color===o)break;sf(a,o,e,n,t,this._board[n].type,Q.CAPTURE);break}if(t===`n`||t===`k`)break}}}}if((i===void 0||i===`k`)&&(!u||l===this._kings[o])){if(this._castling[o]&Q.KSIDE_CASTLE){let e=this._kings[o],t=e+2;!this._board[e+1]&&!this._board[t]&&!this._attacked(s,this._kings[o])&&!this._attacked(s,e+1)&&!this._attacked(s,t)&&sf(a,o,this._kings[o],t,`k`,void 0,Q.KSIDE_CASTLE)}if(this._castling[o]&Q.QSIDE_CASTLE){let e=this._kings[o],t=e-2;!this._board[e-1]&&!this._board[e-2]&&!this._board[e-3]&&!this._attacked(s,this._kings[o])&&!this._attacked(s,e-1)&&!this._attacked(s,t)&&sf(a,o,this._kings[o],t,`k`,void 0,Q.QSIDE_CASTLE)}}if(!e||this._kings[o]===-1)return a;let d=[];for(let e=0,t=a.length;e<t;e++)this._makeMove(a[e]),this._isKingAttacked(o)||d.push(a[e]),this._undoMove();return d}move(e,{strict:t=!1}={}){let n=null;if(typeof e==`string`)n=this._moveFromSan(e,t);else if(e===null)n=this._moveFromSan(`--`,t);else if(typeof e==`object`){let t=this._moves();for(let r=0,i=t.length;r<i;r++)if(e.from===nf(t[r].from)&&e.to===nf(t[r].to)&&(!(`promotion`in t[r])||e.promotion===t[r].promotion)){n=t[r];break}}if(!n)throw Error(typeof e==`string`?`Invalid move: ${e}`:`Invalid move: ${JSON.stringify(e)}`);if(this.isCheck()&&n.flags&Q.NULL_MOVE)throw Error(`Null move not allowed when in check`);let r=new zd(this,n);return this._makeMove(n),this._incPositionCount(),r}_push(e){this._history.push({move:e,kings:{b:this._kings.b,w:this._kings.w},turn:this._turn,castling:{b:this._castling.b,w:this._castling.w},epSquare:this._epSquare,halfMoves:this._halfMoves,moveNumber:this._moveNumber})}_movePiece(e,t){this._hash^=this._pieceKey(e),this._board[t]=this._board[e],delete this._board[e],this._hash^=this._pieceKey(t)}_makeMove(e){let t=this._turn,n=rf(t);if(this._push(e),e.flags&Q.NULL_MOVE){t===`b`&&this._moveNumber++,this._halfMoves++,this._turn=n,this._epSquare=-1;return}if(this._hash^=this._epKey(),this._hash^=this._castlingKey(),e.captured&&(this._hash^=this._pieceKey(e.to)),this._movePiece(e.from,e.to),e.flags&Q.EP_CAPTURE&&(this._turn===`b`?this._clear(e.to-16):this._clear(e.to+16)),e.promotion&&(this._clear(e.to),this._set(e.to,{type:e.promotion,color:t})),this._board[e.to].type===`k`){if(this._kings[t]=e.to,e.flags&Q.KSIDE_CASTLE){let t=e.to-1,n=e.to+1;this._movePiece(n,t)}else if(e.flags&Q.QSIDE_CASTLE){let t=e.to+1,n=e.to-2;this._movePiece(n,t)}this._castling[t]=0}if(this._castling[t]){for(let n=0,r=Zd[t].length;n<r;n++)if(e.from===Zd[t][n].square&&this._castling[t]&Zd[t][n].flag){this._castling[t]^=Zd[t][n].flag;break}}if(this._castling[n]){for(let t=0,r=Zd[n].length;t<r;t++)if(e.to===Zd[n][t].square&&this._castling[n]&Zd[n][t].flag){this._castling[n]^=Zd[n][t].flag;break}}if(this._hash^=this._castlingKey(),e.flags&Q.BIG_PAWN){let r;r=t===`b`?e.to-16:e.to+16,!(e.to-1&136)&&this._board[e.to-1]?.type===`p`&&this._board[e.to-1]?.color===n||!(e.to+1&136)&&this._board[e.to+1]?.type===`p`&&this._board[e.to+1]?.color===n?(this._epSquare=r,this._hash^=this._epKey()):this._epSquare=-1}else this._epSquare=-1;e.piece===`p`||e.flags&(Q.CAPTURE|Q.EP_CAPTURE)?this._halfMoves=0:this._halfMoves++,t===`b`&&this._moveNumber++,this._turn=n,this._hash^=Ld}undo(){let e=this._hash,t=this._undoMove();if(t){let n=new zd(this,t);return this._decPositionCount(e),n}return null}_undoMove(){let e=this._history.pop();if(e===void 0)return null;this._hash^=this._epKey(),this._hash^=this._castlingKey();let t=e.move;this._kings=e.kings,this._turn=e.turn,this._castling=e.castling,this._epSquare=e.epSquare,this._halfMoves=e.halfMoves,this._moveNumber=e.moveNumber,this._hash^=this._epKey(),this._hash^=this._castlingKey(),this._hash^=Ld;let n=this._turn,r=rf(n);if(t.flags&Q.NULL_MOVE)return t;if(this._movePiece(t.to,t.from),t.piece&&(this._clear(t.from),this._set(t.from,{type:t.piece,color:n})),t.captured)if(t.flags&Q.EP_CAPTURE){let e;e=n===`b`?t.to-16:t.to+16,this._set(e,{type:`p`,color:r})}else this._set(t.to,{type:t.captured,color:r});if(t.flags&(Q.KSIDE_CASTLE|Q.QSIDE_CASTLE)){let e,n;t.flags&Q.KSIDE_CASTLE?(e=t.to+1,n=t.to-1):(e=t.to-2,n=t.to+1),this._movePiece(n,e)}return t}pgn({newline:e=`
`,maxWidth:t=0}={}){let n=[],r=!1;for(let t in this._header)this._header[t]&&n.push(`[${t} "${this._header[t]}"]`+e),r=!0;r&&this._history.length&&n.push(e);let i=e=>{let t=this._comments[this.fen()];if(t!==void 0){let n=e.length>0?` `:``;e=`${e}${n}{${t}}`}return e},a=[];for(;this._history.length>0;)a.push(this._undoMove());let o=[],s=``;for(a.length===0&&o.push(i(``));a.length>0;){s=i(s);let e=a.pop();if(!e)break;if(!this._history.length&&e.color===`b`){let e=`${this._moveNumber}. ...`;s=s?`${s} ${e}`:e}else e.color===`w`&&(s.length&&o.push(s),s=this._moveNumber+`.`);s=s+` `+this._moveToSan(e,this._moves({legal:!0})),this._makeMove(e)}if(s.length&&o.push(i(s)),o.push(this._header.Result||`*`),t===0)return n.join(``)+o.join(` `);let c=function(){return n.length>0&&n[n.length-1]===` `?(n.pop(),!0):!1},l=function(r,i){for(let a of i.split(` `))if(a){if(r+a.length>t){for(;c();)r--;n.push(e),r=0}n.push(a),r+=a.length,n.push(` `),r++}return c()&&r--,r},u=0;for(let r=0;r<o.length;r++){if(u+o[r].length>t&&o[r].includes(`{`)){u=l(u,o[r]);continue}u+o[r].length>t&&r!==0?(n[n.length-1]===` `&&n.pop(),n.push(e),u=0):r!==0&&(n.push(` `),u++),n.push(o[r]),u+=o[r].length}return n.join(``)}header(...e){for(let t=0;t<e.length;t+=2)typeof e[t]==`string`&&typeof e[t+1]==`string`&&(this._header[e[t]]=e[t+1]);return this._header}setHeader(e,t){return this._header[e]=t??Vd[e]??null,this.getHeaders()}removeHeader(e){return e in this._header?(this._header[e]=Vd[e]||null,!0):!1}getHeaders(){let e={};for(let[t,n]of Object.entries(this._header))n!==null&&(e[t]=n);return e}loadPgn(e,{strict:t=!1,newlineChar:n=`\r?
`}={}){n!==`\r?
`&&(e=e.replace(new RegExp(n,`g`),`
`));let r=Od(e);this.reset();let i=r.headers,a=``;for(let e in i)e.toLowerCase()===`fen`&&(a=i[e]),this.header(e,i[e]);if(!t)a&&this.load(a,{preserveHeaders:!0});else if(i.SetUp===`1`){if(!(`FEN`in i))throw Error(`Invalid PGN: FEN tag must be supplied with SetUp tag`);this.load(i.FEN,{preserveHeaders:!0})}let o=r.root;for(;o;){if(o.move){let e=this._moveFromSan(o.move,t);if(e==null)throw Error(`Invalid move in PGN: ${o.move}`);this._makeMove(e),this._incPositionCount()}o.comment!==void 0&&(this._comments[this.fen()]=o.comment),o=o.variations[0]}let s=r.result;s&&Object.keys(this._header).length&&this._header.Result!==s&&this.setHeader(`Result`,s)}_moveToSan(e,t){let n=``;if(e.flags&Q.KSIDE_CASTLE)n=`O-O`;else if(e.flags&Q.QSIDE_CASTLE)n=`O-O-O`;else if(e.flags&Q.NULL_MOVE)return`--`;else{if(e.piece!==`p`){let r=of(e,t);n+=e.piece.toUpperCase()+r}e.flags&(Q.CAPTURE|Q.EP_CAPTURE)&&(e.piece===`p`&&(n+=nf(e.from)[0]),n+=`x`),n+=nf(e.to),e.promotion&&(n+=`=`+e.promotion.toUpperCase())}return this._makeMove(e),this.isCheck()&&(this.isCheckmate()?n+=`#`:n+=`+`),this._undoMove(),n}_moveFromSan(e,t=!1){let n=lf(e);if(t||(n===`0-0`?n=`O-O`:n===`0-0-0`&&(n=`O-O-O`)),n==`--`)return{color:this._turn,from:0,to:0,piece:`k`,flags:Q.NULL_MOVE};let r=cf(n),i=this._moves({legal:!0,piece:r});for(let e=0,t=i.length;e<t;e++)if(n===lf(this._moveToSan(i[e],i)))return i[e];if(t)return null;let a,o,s,c,l,u=!1;if(o=n.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/),o?(a=o[1],s=o[2],c=o[3],l=o[4],s.length==1&&(u=!0)):(o=n.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/),o&&(a=o[1],s=o[2],c=o[3],l=o[4],s.length==1&&(u=!0))),r=cf(n),i=this._moves({legal:!0,piece:a||r}),!c)return null;for(let e=0,t=i.length;e<t;e++)if(!s){if(n===lf(this._moveToSan(i[e],i)).replace(`x`,``))return i[e]}else if((!a||a.toLowerCase()==i[e].piece)&&$[s]==i[e].from&&$[c]==i[e].to&&(!l||l.toLowerCase()==i[e].promotion))return i[e];else if(u){let t=nf(i[e].from);if((!a||a.toLowerCase()==i[e].piece)&&$[c]==i[e].to&&(s==t[0]||s==t[1])&&(!l||l.toLowerCase()==i[e].promotion))return i[e]}return null}ascii(){let e=`   +------------------------+
`;for(let t=$.a8;t<=$.h1;t++){if(ef(t)===0&&(e+=` `+`87654321`[$d(t)]+` |`),this._board[t]){let n=this._board[t].type,r=this._board[t].color===`w`?n.toUpperCase():n.toLowerCase();e+=` `+r+` `}else e+=` . `;t+1&136&&(e+=`|
`,t+=8)}return e+=`   +------------------------+
`,e+=`     a  b  c  d  e  f  g  h`,e}perft(e){let t=this._moves({legal:!1}),n=0,r=this._turn;for(let i=0,a=t.length;i<a;i++)this._makeMove(t[i]),this._isKingAttacked(r)||(e-1>0?n+=this.perft(e-1):n++),this._undoMove();return n}setTurn(e){return this._turn==e?!1:(this.move(`--`),!0)}turn(){return this._turn}board(){let e=[],t=[];for(let n=$.a8;n<=$.h1;n++)this._board[n]==null?t.push(null):t.push({square:nf(n),type:this._board[n].type,color:this._board[n].color}),n+1&136&&(e.push(t),t=[],n+=8);return e}squareColor(e){if(e in $){let t=$[e];return($d(t)+ef(t))%2==0?`light`:`dark`}return null}history({verbose:e=!1}={}){let t=[],n=[];for(;this._history.length>0;)t.push(this._undoMove());for(;;){let r=t.pop();if(!r)break;e?n.push(new zd(this,r)):n.push(this._moveToSan(r,this._moves())),this._makeMove(r)}return n}_getPositionCount(e){return this._positionCount.get(e)??0}_incPositionCount(){this._positionCount.set(this._hash,(this._positionCount.get(this._hash)??0)+1)}_decPositionCount(e){let t=this._positionCount.get(e)??0;t===1?this._positionCount.delete(e):this._positionCount.set(e,t-1)}_pruneComments(){let e=[],t={},n=e=>{e in this._comments&&(t[e]=this._comments[e])};for(;this._history.length>0;)e.push(this._undoMove());for(n(this.fen());;){let t=e.pop();if(!t)break;this._makeMove(t),n(this.fen())}this._comments=t}getComment(){return this._comments[this.fen()]}setComment(e){this._comments[this.fen()]=e.replace(`{`,`[`).replace(`}`,`]`)}deleteComment(){return this.removeComment()}removeComment(){let e=this._comments[this.fen()];return delete this._comments[this.fen()],e}getComments(){return this._pruneComments(),Object.keys(this._comments).map(e=>({fen:e,comment:this._comments[e]}))}deleteComments(){return this.removeComments()}removeComments(){return this._pruneComments(),Object.keys(this._comments).map(e=>{let t=this._comments[e];return delete this._comments[e],{fen:e,comment:t}})}setCastlingRights(e,t){for(let n of[`k`,`q`])t[n]!==void 0&&(t[n]?this._castling[e]|=Xd[n]:this._castling[e]&=~Xd[n]);this._updateCastlingRights();let n=this.getCastlingRights(e);return(t.k===void 0||t.k===n.k)&&(t.q===void 0||t.q===n.q)}getCastlingRights(e){return{k:(this._castling[e]&Xd.k)!==0,q:(this._castling[e]&Xd.q)!==0}}moveNumber(){return this._moveNumber}};const df=1858,ff=`a1b1.a1c1.a1d1.a1e1.a1f1.a1g1.a1h1.a1a2.a1b2.a1c2.a1a3.a1b3.a1c3.a1a4.a1d4.a1a5.a1e5.a1a6.a1f6.a1a7.a1g7.a1a8.a1h8.b1a1.b1c1.b1d1.b1e1.b1f1.b1g1.b1h1.b1a2.b1b2.b1c2.b1d2.b1a3.b1b3.b1c3.b1d3.b1b4.b1e4.b1b5.b1f5.b1b6.b1g6.b1b7.b1h7.b1b8.c1a1.c1b1.c1d1.c1e1.c1f1.c1g1.c1h1.c1a2.c1b2.c1c2.c1d2.c1e2.c1a3.c1b3.c1c3.c1d3.c1e3.c1c4.c1f4.c1c5.c1g5.c1c6.c1h6.c1c7.c1c8.d1a1.d1b1.d1c1.d1e1.d1f1.d1g1.d1h1.d1b2.d1c2.d1d2.d1e2.d1f2.d1b3.d1c3.d1d3.d1e3.d1f3.d1a4.d1d4.d1g4.d1d5.d1h5.d1d6.d1d7.d1d8.e1a1.e1b1.e1c1.e1d1.e1f1.e1g1.e1h1.e1c2.e1d2.e1e2.e1f2.e1g2.e1c3.e1d3.e1e3.e1f3.e1g3.e1b4.e1e4.e1h4.e1a5.e1e5.e1e6.e1e7.e1e8.f1a1.f1b1.f1c1.f1d1.f1e1.f1g1.f1h1.f1d2.f1e2.f1f2.f1g2.f1h2.f1d3.f1e3.f1f3.f1g3.f1h3.f1c4.f1f4.f1b5.f1f5.f1a6.f1f6.f1f7.f1f8.g1a1.g1b1.g1c1.g1d1.g1e1.g1f1.g1h1.g1e2.g1f2.g1g2.g1h2.g1e3.g1f3.g1g3.g1h3.g1d4.g1g4.g1c5.g1g5.g1b6.g1g6.g1a7.g1g7.g1g8.h1a1.h1b1.h1c1.h1d1.h1e1.h1f1.h1g1.h1f2.h1g2.h1h2.h1f3.h1g3.h1h3.h1e4.h1h4.h1d5.h1h5.h1c6.h1h6.h1b7.h1h7.h1a8.h1h8.a2a1.a2b1.a2c1.a2b2.a2c2.a2d2.a2e2.a2f2.a2g2.a2h2.a2a3.a2b3.a2c3.a2a4.a2b4.a2c4.a2a5.a2d5.a2a6.a2e6.a2a7.a2f7.a2a8.a2g8.b2a1.b2b1.b2c1.b2d1.b2a2.b2c2.b2d2.b2e2.b2f2.b2g2.b2h2.b2a3.b2b3.b2c3.b2d3.b2a4.b2b4.b2c4.b2d4.b2b5.b2e5.b2b6.b2f6.b2b7.b2g7.b2b8.b2h8.c2a1.c2b1.c2c1.c2d1.c2e1.c2a2.c2b2.c2d2.c2e2.c2f2.c2g2.c2h2.c2a3.c2b3.c2c3.c2d3.c2e3.c2a4.c2b4.c2c4.c2d4.c2e4.c2c5.c2f5.c2c6.c2g6.c2c7.c2h7.c2c8.d2b1.d2c1.d2d1.d2e1.d2f1.d2a2.d2b2.d2c2.d2e2.d2f2.d2g2.d2h2.d2b3.d2c3.d2d3.d2e3.d2f3.d2b4.d2c4.d2d4.d2e4.d2f4.d2a5.d2d5.d2g5.d2d6.d2h6.d2d7.d2d8.e2c1.e2d1.e2e1.e2f1.e2g1.e2a2.e2b2.e2c2.e2d2.e2f2.e2g2.e2h2.e2c3.e2d3.e2e3.e2f3.e2g3.e2c4.e2d4.e2e4.e2f4.e2g4.e2b5.e2e5.e2h5.e2a6.e2e6.e2e7.e2e8.f2d1.f2e1.f2f1.f2g1.f2h1.f2a2.f2b2.f2c2.f2d2.f2e2.f2g2.f2h2.f2d3.f2e3.f2f3.f2g3.f2h3.f2d4.f2e4.f2f4.f2g4.f2h4.f2c5.f2f5.f2b6.f2f6.f2a7.f2f7.f2f8.g2e1.g2f1.g2g1.g2h1.g2a2.g2b2.g2c2.g2d2.g2e2.g2f2.g2h2.g2e3.g2f3.g2g3.g2h3.g2e4.g2f4.g2g4.g2h4.g2d5.g2g5.g2c6.g2g6.g2b7.g2g7.g2a8.g2g8.h2f1.h2g1.h2h1.h2a2.h2b2.h2c2.h2d2.h2e2.h2f2.h2g2.h2f3.h2g3.h2h3.h2f4.h2g4.h2h4.h2e5.h2h5.h2d6.h2h6.h2c7.h2h7.h2b8.h2h8.a3a1.a3b1.a3c1.a3a2.a3b2.a3c2.a3b3.a3c3.a3d3.a3e3.a3f3.a3g3.a3h3.a3a4.a3b4.a3c4.a3a5.a3b5.a3c5.a3a6.a3d6.a3a7.a3e7.a3a8.a3f8.b3a1.b3b1.b3c1.b3d1.b3a2.b3b2.b3c2.b3d2.b3a3.b3c3.b3d3.b3e3.b3f3.b3g3.b3h3.b3a4.b3b4.b3c4.b3d4.b3a5.b3b5.b3c5.b3d5.b3b6.b3e6.b3b7.b3f7.b3b8.b3g8.c3a1.c3b1.c3c1.c3d1.c3e1.c3a2.c3b2.c3c2.c3d2.c3e2.c3a3.c3b3.c3d3.c3e3.c3f3.c3g3.c3h3.c3a4.c3b4.c3c4.c3d4.c3e4.c3a5.c3b5.c3c5.c3d5.c3e5.c3c6.c3f6.c3c7.c3g7.c3c8.c3h8.d3b1.d3c1.d3d1.d3e1.d3f1.d3b2.d3c2.d3d2.d3e2.d3f2.d3a3.d3b3.d3c3.d3e3.d3f3.d3g3.d3h3.d3b4.d3c4.d3d4.d3e4.d3f4.d3b5.d3c5.d3d5.d3e5.d3f5.d3a6.d3d6.d3g6.d3d7.d3h7.d3d8.e3c1.e3d1.e3e1.e3f1.e3g1.e3c2.e3d2.e3e2.e3f2.e3g2.e3a3.e3b3.e3c3.e3d3.e3f3.e3g3.e3h3.e3c4.e3d4.e3e4.e3f4.e3g4.e3c5.e3d5.e3e5.e3f5.e3g5.e3b6.e3e6.e3h6.e3a7.e3e7.e3e8.f3d1.f3e1.f3f1.f3g1.f3h1.f3d2.f3e2.f3f2.f3g2.f3h2.f3a3.f3b3.f3c3.f3d3.f3e3.f3g3.f3h3.f3d4.f3e4.f3f4.f3g4.f3h4.f3d5.f3e5.f3f5.f3g5.f3h5.f3c6.f3f6.f3b7.f3f7.f3a8.f3f8.g3e1.g3f1.g3g1.g3h1.g3e2.g3f2.g3g2.g3h2.g3a3.g3b3.g3c3.g3d3.g3e3.g3f3.g3h3.g3e4.g3f4.g3g4.g3h4.g3e5.g3f5.g3g5.g3h5.g3d6.g3g6.g3c7.g3g7.g3b8.g3g8.h3f1.h3g1.h3h1.h3f2.h3g2.h3h2.h3a3.h3b3.h3c3.h3d3.h3e3.h3f3.h3g3.h3f4.h3g4.h3h4.h3f5.h3g5.h3h5.h3e6.h3h6.h3d7.h3h7.h3c8.h3h8.a4a1.a4d1.a4a2.a4b2.a4c2.a4a3.a4b3.a4c3.a4b4.a4c4.a4d4.a4e4.a4f4.a4g4.a4h4.a4a5.a4b5.a4c5.a4a6.a4b6.a4c6.a4a7.a4d7.a4a8.a4e8.b4b1.b4e1.b4a2.b4b2.b4c2.b4d2.b4a3.b4b3.b4c3.b4d3.b4a4.b4c4.b4d4.b4e4.b4f4.b4g4.b4h4.b4a5.b4b5.b4c5.b4d5.b4a6.b4b6.b4c6.b4d6.b4b7.b4e7.b4b8.b4f8.c4c1.c4f1.c4a2.c4b2.c4c2.c4d2.c4e2.c4a3.c4b3.c4c3.c4d3.c4e3.c4a4.c4b4.c4d4.c4e4.c4f4.c4g4.c4h4.c4a5.c4b5.c4c5.c4d5.c4e5.c4a6.c4b6.c4c6.c4d6.c4e6.c4c7.c4f7.c4c8.c4g8.d4a1.d4d1.d4g1.d4b2.d4c2.d4d2.d4e2.d4f2.d4b3.d4c3.d4d3.d4e3.d4f3.d4a4.d4b4.d4c4.d4e4.d4f4.d4g4.d4h4.d4b5.d4c5.d4d5.d4e5.d4f5.d4b6.d4c6.d4d6.d4e6.d4f6.d4a7.d4d7.d4g7.d4d8.d4h8.e4b1.e4e1.e4h1.e4c2.e4d2.e4e2.e4f2.e4g2.e4c3.e4d3.e4e3.e4f3.e4g3.e4a4.e4b4.e4c4.e4d4.e4f4.e4g4.e4h4.e4c5.e4d5.e4e5.e4f5.e4g5.e4c6.e4d6.e4e6.e4f6.e4g6.e4b7.e4e7.e4h7.e4a8.e4e8.f4c1.f4f1.f4d2.f4e2.f4f2.f4g2.f4h2.f4d3.f4e3.f4f3.f4g3.f4h3.f4a4.f4b4.f4c4.f4d4.f4e4.f4g4.f4h4.f4d5.f4e5.f4f5.f4g5.f4h5.f4d6.f4e6.f4f6.f4g6.f4h6.f4c7.f4f7.f4b8.f4f8.g4d1.g4g1.g4e2.g4f2.g4g2.g4h2.g4e3.g4f3.g4g3.g4h3.g4a4.g4b4.g4c4.g4d4.g4e4.g4f4.g4h4.g4e5.g4f5.g4g5.g4h5.g4e6.g4f6.g4g6.g4h6.g4d7.g4g7.g4c8.g4g8.h4e1.h4h1.h4f2.h4g2.h4h2.h4f3.h4g3.h4h3.h4a4.h4b4.h4c4.h4d4.h4e4.h4f4.h4g4.h4f5.h4g5.h4h5.h4f6.h4g6.h4h6.h4e7.h4h7.h4d8.h4h8.a5a1.a5e1.a5a2.a5d2.a5a3.a5b3.a5c3.a5a4.a5b4.a5c4.a5b5.a5c5.a5d5.a5e5.a5f5.a5g5.a5h5.a5a6.a5b6.a5c6.a5a7.a5b7.a5c7.a5a8.a5d8.b5b1.b5f1.b5b2.b5e2.b5a3.b5b3.b5c3.b5d3.b5a4.b5b4.b5c4.b5d4.b5a5.b5c5.b5d5.b5e5.b5f5.b5g5.b5h5.b5a6.b5b6.b5c6.b5d6.b5a7.b5b7.b5c7.b5d7.b5b8.b5e8.c5c1.c5g1.c5c2.c5f2.c5a3.c5b3.c5c3.c5d3.c5e3.c5a4.c5b4.c5c4.c5d4.c5e4.c5a5.c5b5.c5d5.c5e5.c5f5.c5g5.c5h5.c5a6.c5b6.c5c6.c5d6.c5e6.c5a7.c5b7.c5c7.c5d7.c5e7.c5c8.c5f8.d5d1.d5h1.d5a2.d5d2.d5g2.d5b3.d5c3.d5d3.d5e3.d5f3.d5b4.d5c4.d5d4.d5e4.d5f4.d5a5.d5b5.d5c5.d5e5.d5f5.d5g5.d5h5.d5b6.d5c6.d5d6.d5e6.d5f6.d5b7.d5c7.d5d7.d5e7.d5f7.d5a8.d5d8.d5g8.e5a1.e5e1.e5b2.e5e2.e5h2.e5c3.e5d3.e5e3.e5f3.e5g3.e5c4.e5d4.e5e4.e5f4.e5g4.e5a5.e5b5.e5c5.e5d5.e5f5.e5g5.e5h5.e5c6.e5d6.e5e6.e5f6.e5g6.e5c7.e5d7.e5e7.e5f7.e5g7.e5b8.e5e8.e5h8.f5b1.f5f1.f5c2.f5f2.f5d3.f5e3.f5f3.f5g3.f5h3.f5d4.f5e4.f5f4.f5g4.f5h4.f5a5.f5b5.f5c5.f5d5.f5e5.f5g5.f5h5.f5d6.f5e6.f5f6.f5g6.f5h6.f5d7.f5e7.f5f7.f5g7.f5h7.f5c8.f5f8.g5c1.g5g1.g5d2.g5g2.g5e3.g5f3.g5g3.g5h3.g5e4.g5f4.g5g4.g5h4.g5a5.g5b5.g5c5.g5d5.g5e5.g5f5.g5h5.g5e6.g5f6.g5g6.g5h6.g5e7.g5f7.g5g7.g5h7.g5d8.g5g8.h5d1.h5h1.h5e2.h5h2.h5f3.h5g3.h5h3.h5f4.h5g4.h5h4.h5a5.h5b5.h5c5.h5d5.h5e5.h5f5.h5g5.h5f6.h5g6.h5h6.h5f7.h5g7.h5h7.h5e8.h5h8.a6a1.a6f1.a6a2.a6e2.a6a3.a6d3.a6a4.a6b4.a6c4.a6a5.a6b5.a6c5.a6b6.a6c6.a6d6.a6e6.a6f6.a6g6.a6h6.a6a7.a6b7.a6c7.a6a8.a6b8.a6c8.b6b1.b6g1.b6b2.b6f2.b6b3.b6e3.b6a4.b6b4.b6c4.b6d4.b6a5.b6b5.b6c5.b6d5.b6a6.b6c6.b6d6.b6e6.b6f6.b6g6.b6h6.b6a7.b6b7.b6c7.b6d7.b6a8.b6b8.b6c8.b6d8.c6c1.c6h1.c6c2.c6g2.c6c3.c6f3.c6a4.c6b4.c6c4.c6d4.c6e4.c6a5.c6b5.c6c5.c6d5.c6e5.c6a6.c6b6.c6d6.c6e6.c6f6.c6g6.c6h6.c6a7.c6b7.c6c7.c6d7.c6e7.c6a8.c6b8.c6c8.c6d8.c6e8.d6d1.d6d2.d6h2.d6a3.d6d3.d6g3.d6b4.d6c4.d6d4.d6e4.d6f4.d6b5.d6c5.d6d5.d6e5.d6f5.d6a6.d6b6.d6c6.d6e6.d6f6.d6g6.d6h6.d6b7.d6c7.d6d7.d6e7.d6f7.d6b8.d6c8.d6d8.d6e8.d6f8.e6e1.e6a2.e6e2.e6b3.e6e3.e6h3.e6c4.e6d4.e6e4.e6f4.e6g4.e6c5.e6d5.e6e5.e6f5.e6g5.e6a6.e6b6.e6c6.e6d6.e6f6.e6g6.e6h6.e6c7.e6d7.e6e7.e6f7.e6g7.e6c8.e6d8.e6e8.e6f8.e6g8.f6a1.f6f1.f6b2.f6f2.f6c3.f6f3.f6d4.f6e4.f6f4.f6g4.f6h4.f6d5.f6e5.f6f5.f6g5.f6h5.f6a6.f6b6.f6c6.f6d6.f6e6.f6g6.f6h6.f6d7.f6e7.f6f7.f6g7.f6h7.f6d8.f6e8.f6f8.f6g8.f6h8.g6b1.g6g1.g6c2.g6g2.g6d3.g6g3.g6e4.g6f4.g6g4.g6h4.g6e5.g6f5.g6g5.g6h5.g6a6.g6b6.g6c6.g6d6.g6e6.g6f6.g6h6.g6e7.g6f7.g6g7.g6h7.g6e8.g6f8.g6g8.g6h8.h6c1.h6h1.h6d2.h6h2.h6e3.h6h3.h6f4.h6g4.h6h4.h6f5.h6g5.h6h5.h6a6.h6b6.h6c6.h6d6.h6e6.h6f6.h6g6.h6f7.h6g7.h6h7.h6f8.h6g8.h6h8.a7a1.a7g1.a7a2.a7f2.a7a3.a7e3.a7a4.a7d4.a7a5.a7b5.a7c5.a7a6.a7b6.a7c6.a7b7.a7c7.a7d7.a7e7.a7f7.a7g7.a7h7.a7a8.a7b8.a7c8.b7b1.b7h1.b7b2.b7g2.b7b3.b7f3.b7b4.b7e4.b7a5.b7b5.b7c5.b7d5.b7a6.b7b6.b7c6.b7d6.b7a7.b7c7.b7d7.b7e7.b7f7.b7g7.b7h7.b7a8.b7b8.b7c8.b7d8.c7c1.c7c2.c7h2.c7c3.c7g3.c7c4.c7f4.c7a5.c7b5.c7c5.c7d5.c7e5.c7a6.c7b6.c7c6.c7d6.c7e6.c7a7.c7b7.c7d7.c7e7.c7f7.c7g7.c7h7.c7a8.c7b8.c7c8.c7d8.c7e8.d7d1.d7d2.d7d3.d7h3.d7a4.d7d4.d7g4.d7b5.d7c5.d7d5.d7e5.d7f5.d7b6.d7c6.d7d6.d7e6.d7f6.d7a7.d7b7.d7c7.d7e7.d7f7.d7g7.d7h7.d7b8.d7c8.d7d8.d7e8.d7f8.e7e1.e7e2.e7a3.e7e3.e7b4.e7e4.e7h4.e7c5.e7d5.e7e5.e7f5.e7g5.e7c6.e7d6.e7e6.e7f6.e7g6.e7a7.e7b7.e7c7.e7d7.e7f7.e7g7.e7h7.e7c8.e7d8.e7e8.e7f8.e7g8.f7f1.f7a2.f7f2.f7b3.f7f3.f7c4.f7f4.f7d5.f7e5.f7f5.f7g5.f7h5.f7d6.f7e6.f7f6.f7g6.f7h6.f7a7.f7b7.f7c7.f7d7.f7e7.f7g7.f7h7.f7d8.f7e8.f7f8.f7g8.f7h8.g7a1.g7g1.g7b2.g7g2.g7c3.g7g3.g7d4.g7g4.g7e5.g7f5.g7g5.g7h5.g7e6.g7f6.g7g6.g7h6.g7a7.g7b7.g7c7.g7d7.g7e7.g7f7.g7h7.g7e8.g7f8.g7g8.g7h8.h7b1.h7h1.h7c2.h7h2.h7d3.h7h3.h7e4.h7h4.h7f5.h7g5.h7h5.h7f6.h7g6.h7h6.h7a7.h7b7.h7c7.h7d7.h7e7.h7f7.h7g7.h7f8.h7g8.h7h8.a8a1.a8h1.a8a2.a8g2.a8a3.a8f3.a8a4.a8e4.a8a5.a8d5.a8a6.a8b6.a8c6.a8a7.a8b7.a8c7.a8b8.a8c8.a8d8.a8e8.a8f8.a8g8.a8h8.b8b1.b8b2.b8h2.b8b3.b8g3.b8b4.b8f4.b8b5.b8e5.b8a6.b8b6.b8c6.b8d6.b8a7.b8b7.b8c7.b8d7.b8a8.b8c8.b8d8.b8e8.b8f8.b8g8.b8h8.c8c1.c8c2.c8c3.c8h3.c8c4.c8g4.c8c5.c8f5.c8a6.c8b6.c8c6.c8d6.c8e6.c8a7.c8b7.c8c7.c8d7.c8e7.c8a8.c8b8.c8d8.c8e8.c8f8.c8g8.c8h8.d8d1.d8d2.d8d3.d8d4.d8h4.d8a5.d8d5.d8g5.d8b6.d8c6.d8d6.d8e6.d8f6.d8b7.d8c7.d8d7.d8e7.d8f7.d8a8.d8b8.d8c8.d8e8.d8f8.d8g8.d8h8.e8e1.e8e2.e8e3.e8a4.e8e4.e8b5.e8e5.e8h5.e8c6.e8d6.e8e6.e8f6.e8g6.e8c7.e8d7.e8e7.e8f7.e8g7.e8a8.e8b8.e8c8.e8d8.e8f8.e8g8.e8h8.f8f1.f8f2.f8a3.f8f3.f8b4.f8f4.f8c5.f8f5.f8d6.f8e6.f8f6.f8g6.f8h6.f8d7.f8e7.f8f7.f8g7.f8h7.f8a8.f8b8.f8c8.f8d8.f8e8.f8g8.f8h8.g8g1.g8a2.g8g2.g8b3.g8g3.g8c4.g8g4.g8d5.g8g5.g8e6.g8f6.g8g6.g8h6.g8e7.g8f7.g8g7.g8h7.g8a8.g8b8.g8c8.g8d8.g8e8.g8f8.g8h8.h8a1.h8h1.h8b2.h8h2.h8c3.h8h3.h8d4.h8h4.h8e5.h8h5.h8f6.h8g6.h8h6.h8f7.h8g7.h8h7.h8a8.h8b8.h8c8.h8d8.h8e8.h8f8.h8g8.a7a8q.a7a8r.a7a8b.a7b8q.a7b8r.a7b8b.b7a8q.b7a8r.b7a8b.b7b8q.b7b8r.b7b8b.b7c8q.b7c8r.b7c8b.c7b8q.c7b8r.c7b8b.c7c8q.c7c8r.c7c8b.c7d8q.c7d8r.c7d8b.d7c8q.d7c8r.d7c8b.d7d8q.d7d8r.d7d8b.d7e8q.d7e8r.d7e8b.e7d8q.e7d8r.e7d8b.e7e8q.e7e8r.e7e8b.e7f8q.e7f8r.e7f8b.f7e8q.f7e8r.f7e8b.f7f8q.f7f8r.f7f8b.f7g8q.f7g8r.f7g8b.g7f8q.g7f8r.g7f8b.g7g8q.g7g8r.g7g8b.g7h8q.g7h8r.g7h8b.h7g8q.h7g8r.h7g8b.h7h8q.h7h8r.h7h8b`.split(`.`),pf=new Map;for(let e=0;e<ff.length;e++)pf.set(ff[e],e);if(ff.length!==df)throw Error(`MOVE_TABLE length ${ff.length} !== ${df}`);function mf(e){return e^56}function hf(e){return`${e[0]}${9-parseInt(e[1],10)}`}function gf(e){return`${hf(e.slice(0,2))}${hf(e.slice(2,4))}${e.slice(4)}`}function _f(e){if(e.length===5&&e[4]===`n`){let t=e.slice(0,4),n=pf.get(t);return n===void 0?-1:n}let t=pf.get(e);return t===void 0?-1:t}function vf(e){let t=e.trim().split(/\s+/);if(t.length<4)throw Error(`invalid FEN: ${e}`);let[n,r,i,,a,o]=t,s=Array(64).fill(``),c=n.split(`/`);if(c.length!==8)throw Error(`invalid FEN board: ${n}`);for(let e=0;e<8;e++){let t=c[e],n=7-e,r=0;for(let e of t)if(e>=`1`&&e<=`8`)r+=parseInt(e,10);else{let t=n*8+r;s[t]=e,r++}}return{squares:s,stm:r===`b`?`b`:`w`,castling:{K:i.includes(`K`),Q:i.includes(`Q`),k:i.includes(`k`),q:i.includes(`q`)},halfmoveClock:a&&parseInt(a,10)||0,fullmoveNumber:o&&parseInt(o,10)||1}}const yf={P:0,N:1,B:2,R:3,Q:4,K:5};function bf(e,t,n,r){let i=n.stm===`b`;for(let r=0;r<64;r++){let a=n.squares[r];if(!a)continue;let o=a>=`A`&&a<=`Z`,s=yf[a.toUpperCase()];if(s===void 0)continue;let c=s+((i?!o:o)?0:6),l=i?mf(r):r;e[t+c*64+l]=1}if(r>=2){let n=t+768;for(let t=0;t<64;t++)e[n+t]=1}}function xf(e,t=[]){let n=new Float32Array(7168),r=vf(e),i=[r];for(let e=0;e<7;e++){let n=t[e];if(n)try{i.push(vf(n))}catch{break}else break}let a=[e,...t],o=e=>e.trim().split(/\s+/).slice(0,4).join(` `),s=new Map;for(let e of a){let t=o(e);s.set(t,(s.get(t)??0)+1)}for(let e=0;e<i.length;e++){let t=e*13*64,r=o(a[e]);bf(n,t,i[e],s.get(r)??1)}let c=r.stm===`b`,l=c?r.castling.k:r.castling.K,u=c?r.castling.q:r.castling.Q,d=c?r.castling.K:r.castling.k,f=c?r.castling.Q:r.castling.q,p=(e,t)=>{if(t===0)return;let r=e*64;for(let e=0;e<64;e++)n[r+e]=t};return p(104,+!!l),p(105,+!!u),p(106,+!!d),p(107,+!!f),p(108,+!!c),p(109,Math.min(1,r.halfmoveClock/99)),p(110,Math.min(1,r.fullmoveNumber/99)),p(111,1),n}function Sf(e,t,n=1,r=Math.random){if(t.length===0)throw Error(`sampleFromPolicy: no legal moves`);let i=[];for(let n of t){let t=_f(n);t<0||i.push({uci:n,logit:e[t]??-1/0})}if(i.length===0)return t[0];if(n<=0){let e=0;for(let t=1;t<i.length;t++)i[t].logit>i[e].logit&&(e=t);return i[e].uci}let a=-1/0;for(let e of i)e.logit>a&&(a=e.logit);let o=0,s=i.map(e=>{let t=Math.exp((e.logit-a)/n);return o+=t,t});if(o<=0||!Number.isFinite(o)){let e=0;for(let t=1;t<i.length;t++)i[t].logit>i[e].logit&&(e=t);return i[e].uci}let c=r()*o,l=0;for(let e=0;e<s.length;e++)if(l+=s[e],c<=l)return i[e].uci;return i[i.length-1].uci}function Cf(e){let t=new uf(e),n=t.moves({verbose:!0}),r=t.turn()===`b`,i=[],a=new Map;for(let e of n){let t=e.promotion??``,n=`${e.from}${e.to}${t}`,o=r?gf(n):n;i.push(o),a.set(o,n)}return{whitePerspectiveUcis:i,backMap:a}}S.wasm.wasmPaths=`/ChessCoach/ort/`;const wf=new Map,Tf=e=>{self.postMessage(e)};self.onmessage=async e=>{let t=e.data;if(t.type===`load`){if(wf.has(t.modelKey)){Tf({type:`loaded`,modelKey:t.modelKey});return}try{let e=await Te.create(t.modelUrl,{executionProviders:[`wasm`]});wf.set(t.modelKey,e),Tf({type:`loaded`,modelKey:t.modelKey})}catch(e){Tf({type:`load_error`,modelKey:t.modelKey,error:String(e)})}return}if(t.type===`predict`){let e=wf.get(t.modelKey);if(!e){Tf({type:`predict_error`,reqId:t.reqId,error:`model not loaded`});return}try{let n=xf(t.fen),r=new he(`float32`,n,[1,112,8,8]),i=e.inputNames[0],a=(await e.run({[i]:r}))[e.outputNames.find(e=>e.includes(`policy`))??e.outputNames[0]].data,{whitePerspectiveUcis:o,backMap:s}=Cf(t.fen),c=Sf(a,o,1),l=s.get(c)??c;Tf({type:`prediction`,reqId:t.reqId,uci:l})}catch(e){Tf({type:`predict_error`,reqId:t.reqId,error:String(e)})}}};