//!vertex
#define MAX_BONES_COUNT 128
#define MAX_BONES_DEEP  16

attribute vec3 aVertexPosition, aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec4 aVertexLinks, aVertexWeights;

uniform mat4 uMVMatrix, uPMatrix;
uniform mat3 uNMatrix;

uniform float uTimescale;
uniform ivec3 uDataWidth;

uniform sampler2D uAnimPos, uAnimQuat, uBindPose;

uniform int uSkeleton[MAX_BONES_COUNT];

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;

mat4 getWorldMatrix(in int bone){
	vec3 p = texture2D(uAnimPos, vec2((float(bone) + .5) / float(uDataWidth.x), uTimescale)).xyz;
	vec4 q = texture2D(uAnimQuat, vec2((float(bone) + .5) / float(uDataWidth.x), uTimescale));
    vec3 q2 = pow(q.xyz, vec3(2.0));
    
	mat4 world = mat4(1.0-2.0*q2.y-2.0*q2.z, 2.0*q.x*q.y-2.0*q.z*q.w, 2.0*q.x*q.z+2.0*q.y*q.w, 0.0, 
				2.0*q.x*q.y+2.0*q.z*q.w, 1.0-2.0*q2.x-2.0*q2.z, 2.0*q.y*q.z-2.0*q.x*q.w, 0.0, 
				2.0*q.x*q.z-2.0*q.y*q.w, 2.0*q.y*q.z+2.0*q.x*q.w, 1.0-2.0*q2.x-2.0*q2.y, 0.0, 
				p.x, p.y, p.z, 1.0);
    
    int parent = bone;    
	for(int i = 0; i < MAX_BONES_DEEP; i++){
		parent = uSkeleton[parent];
		if(parent == -1) 
			break;
            
        p = texture2D(uAnimPos, vec2((float(parent) + .5) / float(uDataWidth.x), uTimescale)).xyz;
        q = texture2D(uAnimQuat, vec2((float(parent) + .5) / float(uDataWidth.x), uTimescale));
        q2 = pow(q.xyz, vec3(2.0));
        
		world = mat4(1.0-2.0*q2.y-2.0*q2.z, 2.0*q.x*q.y-2.0*q.z*q.w, 2.0*q.x*q.z+2.0*q.y*q.w, 0.0, 
				2.0*q.x*q.y+2.0*q.z*q.w, 1.0-2.0*q2.x-2.0*q2.z, 2.0*q.y*q.z-2.0*q.x*q.w, 0.0, 
				2.0*q.x*q.z-2.0*q.y*q.w, 2.0*q.y*q.z+2.0*q.x*q.w, 1.0-2.0*q2.x-2.0*q2.y, 0.0, 
				p.x, p.y, p.z, 1.0) * world;
	}
	return world;
}

mat4 getInverseMatrix(in int bone){
	return mat4(
		texture2D(uBindPose, vec2( .5 / 4.0, (float(bone) + .5) / float(uDataWidth.z))),
		texture2D(uBindPose, vec2(1.5 / 4.0, (float(bone) + .5) / float(uDataWidth.z))),
		texture2D(uBindPose, vec2(2.5 / 4.0, (float(bone) + .5) / float(uDataWidth.z))),
		texture2D(uBindPose, vec2(3.5 / 4.0, (float(bone) + .5) / float(uDataWidth.z)))
	);
}

void main(void) {
	mat4 animMatrix = mat4(0);
	for( int i = 0; i < 4; i++ ){
		if(aVertexWeights[i] > 0.0){
			int link = int(aVertexLinks[i]);
			animMatrix += getWorldMatrix(link) * getInverseMatrix(link) * aVertexWeights[i];
		}
	}
	gl_Position = uPMatrix * uMVMatrix * animMatrix * vec4(aVertexPosition, 1.0);
	
	vTextureCoord = aTextureCoord;
	vTransformedNormal = uNMatrix * mat3(animMatrix) * aVertexNormal;
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