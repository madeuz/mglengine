//!vertex
attribute vec2 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec4 uScaleFactor, uFineBlockOrig;
uniform vec2 uViewerPos;//, uAlphaOffset, uOneOverWidth;

uniform sampler2D uElevationSampler;
uniform float uZScaleFactor;

uniform vec3 uTextureRanges;

const float updateStep = 8.0;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vTextureWeights;

void main(void) {

	vec2 viewerDiscreet = floor(uViewerPos / updateStep) * updateStep;

	vec2 worldPos = ( aVertexPosition + uScaleFactor.zw ) * uScaleFactor.xy + viewerDiscreet;
	vec2 uv = ( aVertexPosition * uScaleFactor.xy + uFineBlockOrig.zw + viewerDiscreet ) / uFineBlockOrig.xy;
	vTextureCoord = uv;
	
	float height = texture2D(uElevationSampler, uv).x;
	gl_Position =  uPMatrix * uMVMatrix * vec4(worldPos.x, height * uZScaleFactor, worldPos.y, 1.0);
	
	
	vTextureWeights.x = clamp( 1.0 - abs(height - uTextureRanges.x) / 0.3, 0.0, 1.0);
	vTextureWeights.y = clamp( 1.0 - abs(height - uTextureRanges.y) / 0.3, 0.0, 1.0);
	vTextureWeights.z = clamp( 1.0 - abs(height - uTextureRanges.z) / 0.3, 0.0, 1.0);

	float totalWeight = vTextureWeights.x + vTextureWeights.y + vTextureWeights.z;
	vTextureWeights /= totalWeight;


	vec2 offset = vec2(1.0 / uFineBlockOrig.x, 1.0 / uFineBlockOrig.y);

	float t = texture2D(uElevationSampler, vec2(uv.x, uv.y - offset.y)).x * uZScaleFactor;
	float r = texture2D(uElevationSampler, vec2(uv.x + offset.x, uv.y)).x * uZScaleFactor;
	
	vec3 va = normalize(vec3(1.0, r - height, 0.0));
	vec3 vb = normalize(vec3(0.0, height - t, 1.0));
	vec3 normal = cross(va, vb);
	
	vNormal = normal;
}

//!fragment
precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vTextureWeights;

uniform vec3 uAmbientColor;
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform sampler2D uLowSampler;
uniform sampler2D uMiddleSampler;
uniform sampler2D uHighSampler;
uniform sampler2D uResidualSampler;
uniform vec4 uTextureScales;

void main(void) {
	vec3 bump = -normalize(texture2D(uResidualSampler, vTextureCoord * uTextureScales.w).rbg * 2.0 - 1.0);
	vec3 normal = vNormal + bump;
	
	float directionalLightWeighting = max(dot(normalize(normal), uLightingDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
		
	vec4 low = texture2D(uLowSampler, vTextureCoord * uTextureScales.x);
	vec4 middle = texture2D(uMiddleSampler, vTextureCoord * uTextureScales.y);
	vec4 high = texture2D(uHighSampler, vTextureCoord * uTextureScales.z);
	
	vec4 fragmentColor = low * vTextureWeights.x + middle * vTextureWeights.y + high * vTextureWeights.z;
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}