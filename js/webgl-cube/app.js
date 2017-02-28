//
// Following the youtube series starting at:
// https://www.youtube.com/watch?v=kB0ZVUrI4Aw
// glMatric documentation: http://glmatrix.net/
// Texturing: https://open.gl/textures
//

const vertexShaderSource = `
  precision mediump float;

  attribute vec3 vertPosition;
  attribute vec2 vertTexCoord;

  varying vec2 fragTextCoord;

  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProj;

  void main()
  {
    fragTextCoord = vertTexCoord;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 fragTextCoord;
  uniform sampler2D sampler;

  void main() {
    gl_FragColor = texture2D(sampler, fragTextCoord);
  }
`;

const identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);

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
function insertObject(gl, program, vertices, objects) {
  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var objectsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectsBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objects), gl.STATIC_DRAW);

  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation,
    3, // Number of elements per attribute
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset in the input array
  );
  gl.enableVertexAttribArray(positionAttribLocation);

  const texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
  gl.vertexAttribPointer(
    texCoordAttribLocation,
    2, // Number of elements per attribute
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT // Offset in the input array
  );
  gl.enableVertexAttribArray(texCoordAttribLocation);
}

function initTransform(gl, program) {
  const worldMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  const viewMatrix = new Float32Array(16);
  mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
  const projMatrix = new Float32Array(16);
  mat4.perspective(projMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 1000.0);

  return {
    world: {
      matrix: worldMatrix,
      uniform: setUniform(gl, program, 'mWorld', new Float32Array(worldMatrix)),
    },
    view: {
      matrix: viewMatrix,
      uniform: setUniform(gl, program, 'mView', viewMatrix),
    },
    proj: {
      matrix: projMatrix,
      uniform: setUniform(gl, program, 'mProj', new Float32Array(projMatrix)),
    }
  };
}

function createTexture(gl, image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  return texture;
}

function render(gl, angleX, angleY) {
  // console.log('angleX:', angleX, 'angleY:', angleY);
  mat4.rotate(transforms.world.matrix, identityMatrix, angleX, [-1, 0, 0]);
  mat4.rotate(transforms.world.matrix, transforms.world.matrix, angleY, [0, 1, 0]);
  gl.uniformMatrix4fv(transforms.world.uniform, gl.FALSE, transforms.world.matrix);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  //gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function run(gl, program, transforms) {
  const _render = function (gl) {
    render(gl);
    requestAnimationFrame(function () { _render(gl); });
  }
  requestAnimationFrame(function () { _render(gl); });
}

function main() {
  const canvas = document.getElementById("canvas");
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  const program = initGL(gl);

  // Create a triangle
  const vertices = [
   // X, Y, Z       U, V (text coord)
    1.0,  1.0, -5.0, 0.0, 0.0,
    1.0, -1.0, -5.0, 0.0, 1.0,
    -1.0,-1.0, -5.0, 1.0, 1.0,
    -1.0, 1.0, -5.0, 1.0, 0.0,
  ];
  const objects = [
    0, 1, 2,
    0, 2, 3,
  ]

  createTexture(gl, document.getElementById('texture'));

  insertObject(gl, program, vertices, objects);

  gl.useProgram(program);
  transforms = initTransform(gl, program);

  var hammertime = new Hammer(canvas);
  let angleY = 0;
  let angleX = 0;
  let angleYOffset = 0;
  let angleXOffset = 0;
  hammertime.on('pan', function(ev) {
    angleX = (ev.deltaY / canvas.width) * (Math.PI / 2);
    angleY = (ev.deltaX / canvas.height) * (Math.PI / 2);
    console.log('ev.deltaX:', ev.deltaX, 'ev.deltaY:', ev.deltaY, 'angleX:', angleX + angleXOffset, 'angleY:', angleY + angleYOffset);
    render(gl, angleX + angleXOffset, angleY + angleYOffset);
  });
  hammertime.on('panend', function(ev) {
    angleXOffset += angleX;
    angleYOffset += angleY;
  });
  render(gl, 0, 0);
  // run(gl, program, transforms);
}

main();
