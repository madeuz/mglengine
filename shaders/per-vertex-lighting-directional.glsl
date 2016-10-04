//!vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec4 aLinks;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vTextureCoord = aTextureCoord;

	vTransformedNormal = uNMatrix * aVertexNormal;
}

//!fragment
precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;

uniform vec3 uAmbientColor;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform sampler2D uSampler;

void main(void) {
	float directionalLightWeighting = max(dot(normalize(vTransformedNormal), uLightingDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;

	vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}