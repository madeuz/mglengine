//!vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vTextureCoord = aTextureCoord;

	vTransformedNormal = uNMatrix * aVertexNormal;
}

//!fragment
precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform vec3 uAmbientColor;

uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingColor;

uniform sampler2D uSampler;

void main(void) {
	vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);

	float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;

	vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}