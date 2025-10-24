# 🎮 Unity WebGL Játék Fejlesztés

## **📋 Unity Editor Setup**

### **1. Unity Hub telepítése**
- Töltsd le a [Unity Hub](https://unity.com/download)-ot
- Regisztrálj Unity fiókot

### **2. Unity Editor telepítése**
- Unity Hub → Install → Unity 2022.3 LTS
- WebGL Build Support modul hozzáadása

### **3. Új projekt létrehozása**
```
Project Name: MIHASZNA-RoadGame
Template: 3D Core
```

## **🚗 Játék Elemek**

### **Scene Setup**
- **Main Camera**: Perspektíva kamera (FOV: 75°)
- **Directional Light**: Napfény effekt
- **Road**: Hosszú sík (20x200 egység)
- **Car**: Piros kocka (2x1x3 egység)
- **Billboards**: 5 hírdetőtábla különböző pozíciókban

### **Scripts**

#### **GameController.cs**
```csharp
using UnityEngine;
using System.Runtime.InteropServices;

public class GameController : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void SendBillboardIndex(int index);
    
    public Transform car;
    public Transform[] billboards;
    private int currentBillboard = 0;
    
    void Update()
    {
        // Mouse input handling
        if (Input.GetMouseButton(0))
        {
            Vector3 mousePos = Input.mousePosition;
            float x = (mousePos.x / Screen.width) * 2 - 1;
            car.position = new Vector3(x * 8, car.position.y, car.position.z);
        }
        
        // Billboard detection
        int newBillboard = Mathf.FloorToInt(Mathf.Abs(car.position.z + 10) / 20);
        if (newBillboard != currentBillboard && newBillboard < billboards.Length)
        {
            currentBillboard = newBillboard;
            SendBillboardIndex(currentBillboard);
        }
    }
    
    // Called from JavaScript
    public void SetMousePosition(float x, float y)
    {
        car.position = new Vector3(x * 8, car.position.y, car.position.z);
    }
    
    public void SetMouseDown(bool isDown)
    {
        // Handle mouse down state
    }
}
```

#### **Billboard.cs**
```csharp
public class Billboard : MonoBehaviour
{
    public int billboardIndex;
    public Material activeMaterial;
    public Material inactiveMaterial;
    
    void Start()
    {
        GetComponent<Renderer>().material = inactiveMaterial;
    }
    
    public void SetActive(bool active)
    {
        GetComponent<Renderer>().material = active ? activeMaterial : inactiveMaterial;
        transform.localScale = active ? Vector3.one * 1.2f : Vector3.one;
    }
}
```

## **🔧 Build Settings**

### **WebGL Platform**
1. File → Build Settings
2. Platform: WebGL
3. Player Settings:
   - **Resolution**: 1920x1080
   - **Quality**: High
   - **WebGL Memory**: 512MB
   - **Compression Format**: Disabled

### **Build Output**
```
Build/
├── Build.data
├── Build.framework.js
├── Build.loader.js
└── Build.wasm
```

## **📦 React Integráció**

### **Unity Context**
```typescript
const unityContext = new UnityContext({
  loaderUrl: "/unity-game/Build/Build.loader.js",
  dataUrl: "/unity-game/Build/Build.data",
  frameworkUrl: "/unity-game/Build/Build.framework.js",
  codeUrl: "/unity-game/Build/Build.wasm",
});
```

### **Event Communication**
```typescript
// React → Unity
unityContext.send("GameController", "SetMousePosition", x, y);

// Unity → React
unityContext.on("billboardChanged", (index: number) => {
  setCurrentBillboard(index);
});
```

## **🎨 Assets**

### **Materials**
- **Road Material**: Dark gray (Color: #333333)
- **Car Material**: Red (Color: #FF0000)
- **Billboard Active**: Green (Color: #00FF00)
- **Billboard Inactive**: Gray (Color: #666666)

### **Textures**
- Road texture with lane markings
- Billboard textures with text
- Skybox texture

## **🚀 Deployment**

### **Build Process**
1. Unity Editor → Build
2. Copy Build/ folder to `frontend/public/unity-game/`
3. Restart Next.js development server

### **Performance Optimization**
- **LOD (Level of Detail)** for distant objects
- **Occlusion Culling** for hidden objects
- **Texture Compression** for faster loading
- **Asset Bundles** for modular loading

## **🔍 Debugging**

### **Unity Console**
- Window → General → Console
- Check for errors and warnings

### **Browser Console**
- F12 → Console
- Check WebGL errors and React communication

### **Performance Profiler**
- Window → Analysis → Profiler
- Monitor FPS and memory usage

## **📚 További Források**

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
- [React Unity WebGL](https://github.com/jeffreylanters/react-unity-webgl)
- [Unity WebGL Best Practices](https://docs.unity3d.com/Manual/webgl-performance.html)
