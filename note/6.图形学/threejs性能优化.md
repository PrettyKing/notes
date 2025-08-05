# Three.js性能优化

## 概述

我们至少应该以 60fps 的体验为目标。 一些用户甚至可能具有应该以更高帧速率运行体验的配置。 这些通常是游戏玩家，在性能和帧速率方面更加苛刻。

有两个主要限制：

- CPU
- GPU

您需要密切关注性能并在具有不同设置的多个设备上进行测试，如果您的网站应该与这些设备兼容，请不要忘记移动设备。

以下的优化方式不包含传统前端的优化方式，传统前端的性能优化方式应该在3d优化之前就做好。



## 监控

### 1. 监控帧率

帧率要保持在60fps+

threejs：`stats.js`

```js
const tick = () => {
    stats.begin()
    // ...
    stats.end()
}
```



### 2.监控draw的调用

draw是使用GPU绘制三角形的一个动作，当我们有一个包含许多对象、几何图形、材质等的复杂场景时，将会有很多绘制调用。

通常，我们可以说绘制调用越少越好。我们可以使用[Spector.js](https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk/related)监控每一次绘制，matrices, attributes, uniforms等等



## 基础

### 3.良好的代码

使用eslint 规范代码，尽可能将高性能的语法应用在生产环境中。尤其是在 tick函数中，因为每一帧都会调用它



### 4.销毁场景中没用的Objects

一旦你完全确定你不需要像几何图形或材料这样的资源，就把它处理掉。如果你创建一个有关卡的游戏，一旦用户进入下一个关卡，就处理掉上一个关卡的东西。

```javascript
scene.remove(cube)
cube.geometry.dispose()
cube.material.dispose()
```



## Light

### 5. 尽量少的使用Light

尽量减少使用灯。使用起来虽然也很简单，但它们会持续稳定地消耗走计算机的性能。如果你没有选择，使用较性能消耗较少的Light，如`AmbientLight`(环境光)或`DirectionalLight`(定向光)。



### 6. 避免添加删除Light

当你从场景中添加或删除灯光时，所有支持灯光的材质都必须重新编译。，如果你有一个复杂的场景，这可能会造成卡顿掉帧。



## Shadows

### 7.减少使用shadows



### 8.优化 shadow maps

使用CameraHelper来查看将由阴影贴图摄像机渲染的区域，并将其减少到最小的区域。

```javascript
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 6
directionalLight.shadow.camera.left = - 6
directionalLight.shadow.camera.bottom = - 3
directionalLight.shadow.camera.far = 10

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)
```



同时尽量使用最小的分辨率，并对mapSize进行下降处理。

```javascript
directionalLight.shadow.mapSize.set(1024, 1024)
```



### 9.正确的使用使用投射阴影和接收阴影

有些物体可以投射阴影，有些物体可以接收阴影，而有些物体可能两者都做。试着在尽可能少的物体上激活投射阴影和接收阴影。

```javascript
cube.castShadow = true
cube.receiveShadow = false

torusKnot.castShadow = true
torusKnot.receiveShadow = false

sphere.castShadow = true
sphere.receiveShadow = false

floor.castShadow = false
floor.receiveShadow = true
```



### 10. 关闭shadows自动更新

目前，shadows map在每次渲染前都会被更新。我们可以关闭自动更新功能，并提醒Three.js只有在必要时才需要更新shadows map。

```javascript
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
```



## Textures

### 11.Resize textures

textures在GPU内存中占用了大量的空间。对于Mipmap来说，情况甚至更糟。

![](https://upload.wikimedia.org/wikipedia/commons/5/5c/MipMap_Example_STS101.jpg)

纹理文件的体积与此无关，重要的是分辨率。，尽量把分辨率降到最低，同时保持一个合适的效果。



### 12.保持2次方的分辨率

在调整大小的时候，记得要保持2次方的分辨率。这对mipmaps很重要。分辨率不一定是一个正方形，你可以有一个与高度不同的宽度。如果你不这样做，而渲染需要mipmap，Three.js会试着把图像的大小调整到最接近的2次方的分辨率来解决这个问题，但这个过程会耗费资源，并可能导致纹理质量不好。



### 13. 使用正确的格式

使用TinyPNG压缩jpg png。

使用 ktx2格式的textures，体积较小并且在GPU中占用的内存也很小。





## Geometries

### 14.使用BufferGeometries

`Geometry`比` BufferGeometries` 更容易使用，因为它们直接存储顶点、面、颜色等属性（而不是在buffer中），但它们通常速度较慢。`Geometry`在threejs渲染的时候也会转换成` BufferGeometries`，也会有所耗时。



### 15.尽量不要更新顶点

更新一个几何体的顶点对性能的损耗是很严重的。你可以在创建几何体时做一次，但要避免在tick函数中做。

如果你需要对顶点进行动画处理，就用顶点着色器来做。





### 16.复用geometries

如果您有多个mesh使用相同的几何形状，请仅创建一个geometries，并将其用于所有网格

```javascript
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

for(let i = 0; i < 50; i++) {
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10
    mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2
    mesh.rotation.z = (Math.random() - 0.5) * Math.PI * 2
    
    scene.add(mesh)
}
```



### 17.合并geometries

如果几何图形不移动，我们也可以使用`mergeBufferGeometries`将多个Geometries合并成一个，并且与单个mesh一起使用。

```javascript
const geometries = []

for(let i = 0; i < 50; i++) {
	const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
    geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)

    geometry.translate(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    geometries.push(geometry)
}

const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
console.log(mergedGeometry)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(mergedGeometry, material)
scene.add(mesh)
```



## Materials

### 18.复用Materials

与geometries一样，如果我们对多个mesh使用相同类型的材料，仅创建一个并多次使用它。

```javascript
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()
    
for(let i = 0; i < 50; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10
    mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
    mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

    scene.add(mesh)
}
```





### 19. 使用高性能的Materials

[MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)或MeshPhysicalMaterial等一些材质比[MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)、[MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)或[MeshPhongMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)[等](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)材质需要更多资源。我们需要根据效果选择合适的Materials。



## Mesh

### 20.使用InstancedMesh

具有实例渲染支持 的特殊版本的Mesh 。如果您必须渲染大量具有相同几何和材质但具有不同世界变换的对象，请使用 InstancedMesh。InstancedMesh 的使用将帮助您减少绘制调用的数量，从而提高应用程序的整体渲染性能。

```javascript
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.InstancedMesh(geometry, material, 50)
scene.add(mesh)
    
for(let i = 0; i < 50; i++) {
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(
      new THREE.Euler(
        (Math.random() - 0.5) * Math.PI * 2, 
        (Math.random() - 0.5) * Math.PI * 2, 
        0
      )
    )

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(quaternion)
    matrix.setPosition(position)

    mesh.setMatrixAt(i, matrix)
}
```

我们得到的结果几乎与合并几何体一样好，但我们仍然可以通过更改矩阵来移动网格。

如果您打算在`tick`函数中更改这些矩阵，请将其添加到[InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)：

```javascript
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
```





## Models

### 21. Low poly

使用Low poly模型。多边形越少，帧速率就越好。还可以尝试使用法线贴图。它们在性能方面很有优势，并且可以以texture的形式为您提供出色的细节。



### 22.Draco 压缩

如果模型有很多几何形状非常复杂的细节，请使用 Draco 压缩。它可以大幅度减小模型体积。缺点是解压模型时可能会有耗时，并且您还必须加载 Draco 库。





### 23.服务端压缩

Gzip、br服务端压缩，不需要获取加载进度以及渐进式渲染时候可以使用。



### 24. LOD

远处的物体不需要同靠近相机的物体具有相同的模型精度。有许多可以降低远处物体的精度的技巧来提高性能。考虑使用 [LOD](https://threejs.org/docs/#api/en/objects/LOD)（细节层次）物体。你也可以只为远处的物体每 2 或 3 帧更新位置/动画，或者用 billboard 替换它们 - 即物体的图片。



### 25. 增量加载

https://doc.babylonjs.com/divingDeeper/importers/incrementalLoading

使用 .incremental.babylon 格式模型



## Cameras

### 26.视角

当对象不在视野中时，它们将不会被渲染。这称为`frustum culling`。

可以缩小相机的视野。屏幕上的对象越少，要渲染的三角形就越少。



### 27.far and near

就像视野一样，可以减少相机的`near`和`far`属性。如果有一个由山脉、树木、建筑物等组成的广阔世界，用户可能无法看到那些远离山脉的小房子。减少`far`到一个合适的值，那些房子甚至不会渲染。



## Renderer

### 28.Pixel ratio

一些设备具有非常高的像素比。要渲染的像素越多，帧速率就越差。

尝试将渲染器的Pixel ratio限制为`2`：

```javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```



### 29.Power preferences

某些设备可能能够在不同的 GPU 或不同的 GPU 使用之间切换。我们可以通过指定一个属性来提示在实例化[WebGLRenderer时需要什么功率：](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)`powerPreference`

```javascript
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performatnce'
})
```



### 30.web worker render



## Shaders

### 31.保持代码简洁

监视差异很费力，但请尽量保持着色器代码尽可能简单。避免`if`。充分利用 swizzles 和内置函数。

就像在顶点着色器中一样，而不是`if`语句：

```glsl
modelPosition.y += clamp(elevation, 0.5, 1.0) * uDisplacementStrength;
```



### 32.使用textures

使用 perlin 噪声函数很酷，但它会极大地影响您的性能。有时，您最好使用表示噪声的纹理。使用`texture2D()`比 perlin 噪声函数便宜得多，并且我么可以使用 Photoshop 等工具非常有效地生成这些纹理。



### 33.在顶点着色器中进行计算

如果可能，在顶点着色器中进行计算并将结果发送到片段着色器





## 参考

https://discoverthreejs.com/zh/tips-and-tricks/