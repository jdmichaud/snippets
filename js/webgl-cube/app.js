//
// Following the youtube series starting at:
// https://www.youtube.com/watch?v=kB0ZVUrI4Aw
//

const vertexShaderSource = `
  precision mediump float;

  attribute vec2 vertPosition;

  varying vec3 fragColor;

  void main()
  {
    fragColor = vec3(0.0, 0.0, 0.0);
    gl_Position = vec4(vertPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`;

function initShader(gl, shaderSource, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`error compiling ${type} shader: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

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

function initGL(gl) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = initShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = initShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  const program = initProgram(gl, [vertexShader, fragmentShader]);

  return program;
}

function insertObject(gl, program, objectVertices) {
  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectVertices), gl.STATIC_DRAW);
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(positionAttribLocation);
}

function main() {
  const canvas = document.getElementById("canvas");
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  const program = initGL(gl);

  // Create a triangle
  const objectVertices = [
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ];
  insertObject(gl, program, objectVertices);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
