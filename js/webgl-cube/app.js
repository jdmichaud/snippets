//
// Following the youtube series starting at:
// https://www.youtube.com/watch?v=kB0ZVUrI4Aw
// glMatric documentation: http://glmatrix.net/
//

const vertexShaderSource = `
  precision mediump float;

  attribute vec3 vertPosition;

  varying vec3 fragColor;

  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProj;

  void main()
  {
    fragColor = vec3(0.0, 0.0, 0.0);
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`;

/*
 * Create a shader, associate it with its GLSL code above and compile it.
 */
function initShader(gl, shaderSource, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`error compiling ${type} shader: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

/*
 * Queue the shader into the program and link and valdate the program.
 */
function initProgram(gl, shaders) {
  const program = gl.createProgram();
  shaders.forEach((shader) => gl.attachShader(program, shader));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('error linking program:', gl.getProgramInfoLog(program))
  } else {
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('error validing the program:', gl.getProgramInfoLog(program));
    }
  }
  return program;
}

/*
 * Create the shader and the program.
 */
function initGL(gl) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = initShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = initShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  const program = initProgram(gl, [vertexShader, fragmentShader]);

  return program;
}

function setUniform(gl, program, variable, matrix) {
  const matUniformLocation = gl.getUniformLocation(program, variable);
  gl.uniformMatrix4fv(matUniformLocation, gl.FALSE, matrix);
  return matUniformLocation;
}

/*
 * Insert an object described by a array of vertices into the rendering queue.
 */
function insertObject(gl, program, objectVertices) {
  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectVertices), gl.STATIC_DRAW);
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation,
    3, // Number of elements per attribute
    gl.FLOAT,
    gl.FALSE,
    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset in the input array
  );
  gl.enableVertexAttribArray(positionAttribLocation);
}

function initTransform(gl, program) {
  const worldMatrix = [
    0.95, 0.0, 0.0, 0.0,
    0.0, 0.95, 0.0, 0.0,
    0.0, 0.0, 0.95, 0.0,
    0.0, 0.0, 0.0, 1.0,
  ];
  const viewMatrix = new Float32Array(16);
  mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
  const projMatrix = new Float32Array(16);
  mat4.perspective(projMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 1000.0);

  setUniform(gl, program, 'mWorld', new Float32Array(worldMatrix));
  setUniform(gl, program, 'mView', viewMatrix);
  setUniform(gl, program, 'mProj', new Float32Array(projMatrix));

  return {
    worldMatrix,
    viewMatrix,
    projMatrix,
  };
}

function render() {
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(arguments.callee);
}

function main() {
  const canvas = document.getElementById("canvas");
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  const program = initGL(gl);

  // Create a triangle
  const objectVertices = [
   // X, Y, Z
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ];
  insertObject(gl, program, objectVertices);

  gl.useProgram(program);
  transforms = initTransform(gl, program);
  requestAnimationFrame(render);
}

main();
