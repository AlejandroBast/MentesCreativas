# Desarrollo Actividad

## Guía rápida del proyecto

- Stack: React + Vite (TypeScript), Tailwind, react-router-dom, Three.js.
- Desarrollo: `npm run dev` arranca en `http://localhost:5173/`.
- Calidad: `npm run lint`, `npm run type-check`, `npm test`.
- Producción: `npm run build` y `npm run preview`.
- Node recomendado: 18+.

### Rutas y módulos actuales

- `/` Dashboard con tarjetas, estadísticas y accesos rápidos.
- `/color3d` Matemáticas 3D: paleta HEX/HSL y vista de modelo.
- `/robot3d` Tecnología: robot 3D con cámara, animaciones y resaltado.
- `/watercycle` Ciencias: ciclo del agua con etapas animadas y panel informativo.
- `/settings` Configuración: tema y panel descriptivo de accesibilidad.

### Preferencias y eventos

- Estadísticas: clave `mc:stats`, evento `stats:updated`.
- Accesibilidad: clave `mc:a11y` con `highContrast`, `reduceMotion`, `focusVisible`; evento `a11y:changed`.
- Robot 3D: `robot3d-speed`, `robot3d-setview`, `robot3d-walk`, `robot3d-game-over`, `robot3d-piece-selected`.

### Accesibilidad

- Controles etiquetados y foco visible en dashboard y vistas.
- Opción de alto contraste y reducir movimiento desde el dashboard.
- Auditoría opcional en desarrollo con `axe-core` si está disponible.

### Animaciones y visuales

- Robot: postprocesado con bloom y outline, entorno con RoomEnvironment, parpadeo de ojos y pulso de luz del pecho.
- Ciclo del Agua: partículas densificadas con variaciones de tamaño y tiempo, gotas con glow y panel animado.
- Sidebar: gradientes, estados hover/activo y colores por módulo.

## 1. Aplicación del modelo de calidad ISO/IEC 25010

### Atributo seleccionado: 
*Usabilidad:* Es la capacidad del sistema para que personas reales logren sus objetivos de forma eficaz, eficiente y satisfactoria en un contexto de uso. Incluye que el usuario entienda qué puede hacer, aprenda rápido, controle la interfaz, cometa pocos errores (y se recupere fácil), y que la experiencia sea agradable y accesible.

sub atributos seleccionados:
- *Estetica UI:* La presentación visual ayuda a comprender y usar mejor: consistencia de estilos, jerarquía clara, espacios en blanco, tipografía legible y alineación. No es “bonito por bonito”: la estética apoya la comprensión.
- *Operabilidad:* Qué tan fácil es operar y controlar el sistema: navegación predecible, feedback inmediato, atajos, deshacer/rehacer, estados claros (cargando, error, éxito) y configuraciones simples.


### Requisitos No Funcionales
| *ID*                      | *EDU-RNF-USE-001*                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| *Título*                  | Estética coherente de la interfaz (Design System + contraste)                                                                                                                                                                                                                                                                                                                                                      |
| *Descripción*             | La UI debe mantener consistencia visual en todas las pantallas mediante un Design System (tokens de color, tipografía, espaciado y estados) y asegurar legibilidad con relaciones de contraste adecuadas.                                                                                                                                                                                                          |
| *Prioridad*               | *Alta*                                                                                                                                                                                                                                                                                                                                                                                                           |
| *Categoría*               | No funcional – Usabilidad (Estética de la UI)                                                                                                                                                                                                                                                                                                                                                                      |
| *Fuente*                  | ISO/IEC 25010 + Stakeholders educativos                                                                                                                                                                                                                                                                                                                                                                            |
| *Criterios de Aceptación* | • 100% de pantallas usan tokens del Design System (tipografías, colores, espaciados y estados).<br>• Contraste mínimo: texto normal ≥ *4.5:1* y texto grande ≥ *3:1.<br>• Estados **hover/focus/active* visibles de forma consistente.<br>• Auditoría visual por muestra (≥10 pantallas por release) con *≥95% sin hallazgos críticos*.<br>• Se adjuntan capturas y reporte automatizado (axe/Lighthouse). |


| *ID*                      | *EDU-RNF-USE-002*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| *Título*                  | Operabilidad: control por teclado y prevención de errores                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| *Descripción*             | Los usuarios deben poder completar los flujos clave solo con teclado, con foco visible y validaciones preventivas que reduzcan errores y den feedback claro.                                                                                                                                                                                                                                                                                                                                                                                                 |
| *Prioridad*               | *Alta*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| *Categoría*               | No funcional – Usabilidad (Operabilidad)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| *Fuente*                  | ISO/IEC 25010 + Stakeholders educativos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| *Criterios de Aceptación* | • Flujos clave (registro, login, recuperación, compra/inscripción) completables *solo con teclado: Tab/Shift+Tab/Enter/Espacio/Escape.<br>• **Foco visible* en todos los elementos interactivos; orden de tabulación lógico.<br>• Validación *en tiempo real* de formularios con mensajes claros y *aria-live* para errores.<br>• *Tasa de éxito ≥ 90%* y *≤ 1 error* promedio en pruebas de 5–8 usuarios por release; *tiempo < 2 min* por tarea.<br>• Sin “trampas de foco” (modales/menús); tamaño táctil ≥ *44×44 px* en vistas móviles. |



                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| *Criterios de Aceptación* | • Cumplimiento *WCAG 2.1 AA* en las vistas definidas; *0 hallazgos críticos* y *0–2 serios* con ticket creado en auditorías axe/Pa11y/Lighthouse.<br>• Roles ARIA, *nombre accesible* y labels correctos en todos los controles; regiones <main>, <nav> y encabezados semánticos.<br>• Lectores de pantalla (NVDA/JAWS/VoiceOver) narran correctamente 3 flujos clave (orden, propósito y estado); *0 bloqueantes.<br>• Interfaz usable en **320px* y con *zoom 200%* sin pérdida de funcionalidad ni solapamientos.<br>• Evidencias adjuntas: reportes automatizados, checklist manual, videos breves (teclado y lector de pantalla). |





## 2. Definición de métricas y criterios de aceptación  
*ISO/IEC 25010 → Usabilidad*  
*Subatributos:* *Estética UI* y *Operabilidad*  
*Ámbito:* Módulos de *Matemáticas/Geometría, **Ciencias Naturales* y *Tecnología*.

### 2.1 Métricas (transversales a los 3 módulos)
| Métrica | Cómo se mide | Umbral |
|---|---|---|
| *Consistencia visual* (tokens: color/tipo/espaciado/estados) | Auditoría de 8–10 pantallas contra un mini Design System | *≥95%* sin hallazgos críticos |
| *Contraste* | Verificación de contraste en textos/controles | Texto normal *≥4.5:1, texto grande **≥3:1* |
| *Foco visible* | Revisión manual en todos los elementos interactivos | *100%* con foco visible y orden lógico |
| *Cobertura de teclado* | Completar flujos con Tab/Shift+Tab/Enter/Espacio/Escape | *100%* de pasos navegables; sin trampas de foco |
| *Tiempo por tarea* | Cronometrar 3 tareas por módulo | *≤2 min* promedio (n=5) |
| *Errores por tarea* | Contar errores/retrocesos y claridad de mensajes | *≤1* error promedio |
| *Feedback inmediato* | Latencia visual al cambiar controles | *<200 ms* por acción clave |

### 2.2 Criterios de aceptación por módulo

#### A) Matemáticas / Geometría
- *Exploración 3D:* cambiar *forma/color/escala* con mouse *y* teclado; ayuda visible (“Rota/Zoom; Tab para controles”); estados hover/focus/active consistentes.  
- *Descomposición:* toggles accesibles para *caras/aristas/vértices; **conteos correctos* (cubo: *6/12/8*); estilos diferenciados (caras semitransparentes, aristas marcadas, vértices destacados).  
- *Simetría:* selector mariposa/estrella + toggle de ejes sin trampas de foco; ejes con estilo coherente.  
- *Fracciones 3D (pizza):* sliders *denominador 2–12* y *numerador 0–den* (validación); muestra *fracción, decimal y %; actualización **<200 ms*.

#### B) Ciencias Naturales
- *Ciclo del agua:* slider de *temperatura* activa evaporación/condensación/precipitación; labels claros; foco visible.  
- *Modelo 3D del paisaje:* rotar/zoom y hotspots con texto breve; estados de activo/seleccionado distinguibles.  
- *Decisiones sostenibles:* botones accesibles; feedback inmediato; opción de deshacer.  
- *Video con subtítulos:* controles nativos; pista .vtt activable; texto de ayuda.

#### C) Tecnología (Pensamiento Lógico / Algoritmos)
- *Editor de bloques:* operar con mouse *y* teclado (selección/orden); foco visible en bloque activo.  
- *Ejecución del algoritmo:* feedback inmediato (trayectoria); botón *Reiniciar* visible.  
- *Validación de entradas:* previene secuencias inválidas con mensajes claros; sin bloqueos de foco.  
- *Estados de sistema:* éxito/error mostrados en <200 ms; jerarquía visual clara.

### 2.3 Definition of Done (DoD) – Usabilidad
- [ ] *Estética UI:* tokens aplicados en pantallas clave; contraste cumple umbrales.  
- [ ] *Operabilidad:* navegación *solo con teclado* en los 3 módulos; foco visible y orden lógico.  
- [ ] *Eficiencia:* tiempos por tarea *≤2 min* y errores *≤1* (muestra n=5).  
- [ ] *Feedback:* acciones clave responden en *<200 ms* en todas las vistas.




## 3. Implementar funcionalidades del frontend

*Stack:* React + Vite (TS), react-router-dom, Three.js (@react-three/fiber + @react-three/drei).  
*Ámbito:* Módulos de *Matemáticas/Geometría, **Ciencias Naturales* y *Tecnología*.

### 3.1 Rutas principales
| Ruta | Vista | Descripción |
|---|---|---|
| /mat/shapes | *ShapeExplorer* | Explorar formas 3D (rotación, zoom, cambio de forma/color/escala). |
| /mat/decomposer | *PolyhedronDecomposer* | Mostrar/ocultar *caras/aristas/vértices* y conteos (cubo 6/12/8). |
| /mat/symmetry | *SymmetryLab* | Simetría *bilateral* (mariposa) y *radial* (estrella) con ejes. |
| /mat/fractions | *FractionPizza* | Fracciones en 3D (pizza): sliders *denominador 2–12* y *numerador 0–den*. |            
| /nat/ciclo | *WaterCycle* | Ciclo del agua: slider de *temperatura* activa estados (evap./cond./precip.). |
| /tec/algoritmos | *BlockAlgorithms* | Secuencias/bucles con bloques y ejecución visual (robot). |

> El *Sidebar* incluye la sección Matemáticas/Geometría con enlaces a las 4 vistas.

### 3.2 Componentes clave
- SceneCanvas: contenedor reusable para escenas 3D con *OrbitControls*, luz y tamaño fijo.

- Quiz: opción múltiple con feedback inmediato.

- Controles accesibles: select, checkbox, range con *labels* y *foco visible*.

### 3.3 Flujos de usuario (resumen)
1. *Seleccionar tema* desde el Sidebar → se abre la vista.  
2. *Interactuar* (3D, sliders, toggles, bloques) con mouse *y* teclado.  
3. *Feedback inmediato* (<200 ms) y estilos consistentes (tokens de color/tipo/espaciado).  
4. *Progreso* se guarda localmente.

### 3.4 Alineación a ISO/IEC 25010 (Usabilidad)
- *Estética UI:* tokens de diseño aplicados, contraste texto normal *≥4.5:1* / grande *≥3:1*, estados hover/focus/active coherentes.
- *Operabilidad:* navegación *solo con teclado* (Tab/Shift+Tab/Enter/Espacio/Escape), *foco visible* y orden lógico; sin trampas de foco.

### 3.5 Criterios de aceptación (frontend)
- *Exploración 3D:* cambiar *forma/color/escala*; ayuda “Rota/Zoom; Tab para controles”.  
- *Descomposición:* toggles accesibles; *conteos correctos* (6/12/8); estilos diferenciados.  
  
 
- *Naturales (Ciclo del agua):* slider de temperatura activa fases; hotspots con texto breve.  
- *Tecnología (Algoritmos):* edición/ejecución de bloques; botón *Reiniciar*.  
- *Accesibilidad y teclado:* 100% de controles navegables; labels correctos.  
- *Rendimiento base:* LCP en Home/Listado *≤ 2.5 s* (dev/preview).

### 3.6 Definition of Done (DoD)
- [ ] Rutas y navegación funcionando (incluye Sidebar).  
- [ ] Controles con *labels* y *foco visible*; flujos completables con teclado.  
- [ ] Tokens de diseño aplicados y *contraste* por encima de los umbrales.  
- [ ] Interacciones clave responden *<200 ms*.  
- [ ] Progreso almacenado en localStorage (si aplica).




## 4 Punto

### Módulo: Matemáticas / Geometría

En este módulo se implementó la funcionalidad de **exploración 3D de fracciones**, representadas mediante los modelos **“pizza” y “pastel”**.  
El objetivo es que el usuario pueda visualizar una fracción como una figura dividida en partes iguales y modificarla de forma interactiva.

La interfaz incluye una **paleta de colores predefinidos** que se aplican de inmediato al modelo 3D activo, permitiendo personalizar su aspecto visual.  
Además, ofrece las siguientes acciones principales:

- **Cambio inmediato de color:** al seleccionar un color, este se refleja instantáneamente en el modelo.  
- **Color aleatorio:** genera un nuevo color de forma automática.  
- **Reiniciar:** restablece la figura al color original por defecto.  
- **Indicador visual:** muestra en pantalla el color actualmente activo en formato hexadecimal.  
- **Selector de modelo:** permite alternar entre los tipos de figura “pizza” y “pastel”, destacando cuál está activa.

Desde el punto de vista de usabilidad, la interfaz garantiza que:
- Los **controles sean visibles y accesibles** tanto con mouse como con teclado.  
- El **color activo** esté siempre indicado de forma clara.  
- Las **acciones tengan respuesta inmediata** (menor a 200 ms).  
- Se mantenga la **consistencia visual** entre todos los elementos de la vista.  
- Se cumplan principios de **accesibilidad (WCAG 2.1 AA)** mediante etiquetas, roles ARIA y foco visible.

En conjunto, esta funcionalidad mejora la comprensión del concepto de fracciones y refuerza la interacción visual y operativa del usuario, cumpliendo los criterios de *usabilidad* y *operabilidad* definidos en la norma **ISO/IEC 25010**.

### Modulo de Tecnologia y Pensamiento Lógico



En este módulo se desarrolló una **simulación 3D interactiva de un robot**, diseñada para que los estudiantes comprendan de forma visual y práctica los conceptos básicos de **secuencias, control de movimientos y lógica algorítmica**.  
El modelo 3D está compuesto por distintas partes (cabeza, brazos, piernas, cuerpo) y permite interactuar con ellas mediante acciones predefinidas y eventos dinámicos.

La funcionalidad principal se centra en que el usuario pueda:
- **Observar y manipular el robot** en un entorno tridimensional.  
- **Controlar la cámara** con rotación, zoom y paneo, manteniendo siempre una vista clara de la escena.   
- **Cambiar de perspectiva** (frontal, lateral, superior o isométrica) según el modo de observación deseado.  
- **Restablecer la vista y la pose** del robot con un solo clic, garantizando siempre un estado inicial limpio.

Desde el punto de vista técnico y de usabilidad:
- Las **interacciones responden inmediatamente**, sin interrupciones ni pérdida de rendimiento.  
- Se asegura una **navegación fluida** con controles intuitivos de cámara.  
- El sistema **destaca visualmente** las partes activas mediante transparencia y contraste, reforzando la comprensión espacial.  
- Todos los eventos (selección, cambio de vista, animación, velocidad) son **independientes y no bloquean la escena principal**, lo que permite una experiencia continua y estable.  
- Cumple los criterios de **operabilidad** del modelo *ISO/IEC 25010*, garantizando que las acciones sean reversibles, predecibles y accesibles.

En conjunto, esta funcionalidad potencia la enseñanza del pensamiento lógico y la estructura de algoritmos a través de la interacción con un robot tridimensional.  
El estudiante no solo observa, sino que **experimenta la lógica** detrás de cada acción, logrando una conexión directa entre el aprendizaje abstracto y la manipulación visual.

### Módulo: Ciencias Naturales

En este módulo se implementó una **simulación interactiva del ciclo del agua**, pensada para ayudar al estudiante a comprender de manera visual y secuencial los procesos naturales de **evaporación, condensación, precipitación y acumulación**.  
La experiencia combina elementos gráficos, texto explicativo y controles simples para avanzar, retroceder o reproducir el ciclo completo.

La interfaz está compuesta por una ilustración dinámica del ciclo (sol, nubes, lluvia y agua acumulada) y un panel lateral que describe, en cada paso, lo que ocurre en esa fase del proceso.  
El estudiante puede **navegar manualmente entre las etapas** o **activar la reproducción automática**, que recorre todas las fases con intervalos de tiempo fijos.

Las principales características del módulo incluyen:
- **Cuatro etapas animadas:** evaporación, condensación, precipitación y acumulación, cada una representada visualmente con cambios en el gráfico SVG.  
- **Controles interactivos:** botones para avanzar, retroceder, reproducir o reiniciar el ciclo en cualquier momento.  
- **Sincronización visual y textual:** el título y la descripción cambian automáticamente según la fase mostrada.  
- **Retroalimentación inmediata:** cada acción tiene respuesta instantánea (menor a 200 ms), con indicadores visuales claros.  
- **Accesibilidad garantizada:** botones con etiquetas descriptivas, foco visible y estados diferenciados (activo, pausa, reproducción).  
- **Diseño adaptable:** interfaz funcional y legible tanto en pantallas pequeñas como en escritorio.

Desde el enfoque de calidad del modelo **ISO/IEC 25010**, esta funcionalidad cumple con los criterios de:
- **Usabilidad:** la interfaz es intuitiva, con interacciones predecibles y respuestas consistentes.  
- **Operabilidad:** el usuario controla el flujo del proceso sin bloqueos ni pérdida de información.  
- **Estética de la UI:** colores coherentes, jerarquía visual clara y representación simbólica alineada con el contenido educativo.

En conjunto, el módulo de Ciencias Naturales transforma un concepto abstracto en una experiencia visual y manipulable, reforzando el aprendizaje mediante la exploración activa y el pensamiento secuencial.




## 5. Pruebas Unitarias

Cómo se aplicó
- Se implementó una batería de pruebas con Jest 30 + React Testing Library sobre componentes clave: `App`, `ColorPalette`, `WaterCycle`, `Robot3DView` y un placeholder `Robot3D`.
- Se validan interacciones, estados y accesibilidad básica (labels, foco visible, cambios de texto). Para Three.js se evita el render real y se prueban eventos que el contenedor emite.

Cómo se integró
- Archivo `src/setupTests.ts` centraliza polyfills (matchMedia, localStorage) y mocks de dependencias pesadas (OrbitControls y vistas 3D en pruebas de flujo).
- Se adaptó el enrutado con imports dinámicos para que Jest no parsee Three.js en el arranque (lazy routes + `Suspense`).
- En CI (`.github/workflows/jest.yml`) las unitarias corren junto con lint, type-check y build.

Análisis de resultados
- La suite es estable: 14 pruebas pasan localmente y en CI sin flakiness reportada.
- Los mocks de 3D eliminaron fallos de WebGL/ESM en `jsdom`, manteniendo la intención de las pruebas (validar eventos y estado, no el render físico).
- Oportunidades: añadir medición de cobertura y aserciones de ARIA más exhaustivas con axe en pruebas unitarias.

## 6. Pruebas de Integración

Cómo se aplicó
- Se cubrieron flujos completos en `src/integration/`: navegación por Sidebar y rutas, conmutación de tema, reproducción del Ciclo del Agua y uso de la Paleta de Colores con el modelo 3D.
- Se usan timers falsos para validar autoplay y progresión temporal, y se mockean vistas 3D pesadas para mantener el entorno ligero.

Cómo se integró
- Los tests emplean `MemoryRouter` y el árbol real de rutas (`AppRoutes`) para simular navegación.
- El estado de tema persiste en `localStorage` y se verifica contra `document.documentElement.classList`.
- Se ejecutan en el mismo job de CI que las unitarias, garantizando feedback en cada PR.

Análisis de resultados
- Los flujos críticos pasan de extremo a extremo: navegación, cambio de tema, ciclo y paleta funcionan según lo esperado.
- Se simplificó la prueba de navegación para evitar errores de canvas, manteniendo cobertura de intención.
- Próximos pasos: pruebas de teclado (Tab order) y verificación de `aria-current` en el Sidebar.
## 7. CI/CD Automatizado

### 7.1 Flujo de Integración Continua (CI)
Se configuró un flujo en GitHub Actions (`.github/workflows/jest.yml`) que ejecuta en cada *push* y *pull request* a `main`:

1. Checkout del repositorio.
2. Instalación reproducible con `npm ci`.
3. `npm run type-check` para validar tipos de TypeScript.
4. `npm run lint` para asegurar estilo y calidad estática.
5. `npm test -- --ci` para correr pruebas unitarias (Jest + React Testing Library).
6. `npm run build` para generar artefacto de producción Vite.
7. Publicación del artefacto `dist` como *artifact* descargable.

La matriz corre en Node 18 y 20 para asegurar compatibilidad. El job cancela ejecuciones anteriores en la misma rama (`concurrency`).

Cómo se aplicó
- Se configuraron workflows dedicados: `jest.yml` (CI de calidad), `deploy-pages.yml` (CD a Pages), `jmeter.yml` y `lighthouse.yml` (pruebas de sistema). Todos comparten instalación reproducible con `npm ci` y build de Vite.

Cómo se integró
- Los checks de tipos, lint, unitarias e integración corren en cada push/PR a `main`. Los jobs de rendimiento/auditoría se ejecutan on-demand vía `workflow_dispatch`.
- El despliegue usa artefactos generados por el build y acciones oficiales de Pages.

Análisis de resultados
- El pipeline provee señales rápidas: falla si hay errores de tipos/lint/tests; build estable tras pruebas.
- Los workflows de sistema suben artefactos (JTL, reportes Lighthouse) y resumen en el Job Summary, facilitando trazabilidad sin bloquear los PRs.

### 7.2 Script Agregado de CI Local
Se añadió el script agregado `npm run ci` en `package.json` que encadena: instalación, type-check, lint, test y build. Útil para reproducir el entorno de Actions localmente antes de hacer push.

```bash
npm run ci
```

### 7.3 Cobertura de Pruebas Unitarias
Pruebas clave incluidas:
- `App.test.tsx`: Verifica encabezado principal renderizado.
- `ColorPalette.test.tsx`: Presets, cambio por HEX válido y copia al portapapeles.
- `WaterCycle.test.tsx`: Navegación entre etapas, selección directa y reproducción automática con timers falsos.
- `Robot3DView.test.tsx`: Emisión de eventos de vista y movimiento (mock del componente pesado Three.js).
- `Robot3D.test.tsx`: Placeholder para futura ampliación sin romper la suite.

### 7.4 Despliegue Continuo (CD)
Workflow `deploy-pages.yml` publica automáticamente el build a **GitHub Pages** tras aprobarse / fusionarse en `main`:

1. Repite validaciones: type-check, lint y test.
2. Construye con `npm run build`.
3. Sube `dist` como artefacto y luego realiza deploy con `actions/deploy-pages@v4`.

#### Requisitos previos para Pages
- Activar GitHub Pages con *Source: GitHub Actions* en la configuración del repositorio.
- Verificar que no existan rutas absolutas problemáticas (Vite maneja raíz por defecto). Si se publica bajo subruta, ajustar `base` en `vite.config`.

### 7.5 Beneficios Alineados a ISO/IEC 25010 (Usabilidad / Operabilidad)
- *Confiabilidad en iteraciones rápidas:* cada cambio pasa por validaciones automáticas (previene regresiones visuales / lógicas).
- *Mantenibilidad:* estructura clara de pruebas facilita refactor seguro.
- *Eficiencia del equipo:* feedback inmediato en PRs sobre errores de lint, tipos o pruebas.

### 7.6 Próximos Pasos Propuestos
- Añadir reporte de cobertura (`--coverage`) y subirlo como artifact.
- Integrar auditoría de accesibilidad (axe/lighthouse) con job separado nocturno o en PR.
- Incorporar prueba de snapshot visual (Playwright) para vistas críticas.
- Añadir badge de estado CI y de deploy en el encabezado de este README.



## 8. Pruebas de Sistema: Rendimiento y Auditorías

### 8.1 Carga y rendimiento con JMeter
Se añadió un plan de prueba (`perf/jmeter-test.jmx`) parametrizable para estresar la página raíz (`/`) con variables:
- `users` (usuarios concurrentes)
- `ramp` (segundos de rampa)
- `duration` (duración total en segundos)

Workflow: `.github/workflows/jmeter.yml`
- Construye el sitio (`npm run build`).
- Sirve `dist` localmente en `http://localhost:8080`.
- Ejecuta JMeter en modo no interactivo con los parámetros configurables desde `workflow_dispatch`.
- Publica `perf/jmeter-results.jtl` como artifact y un resumen en el Job Summary.

Ejecución manual:
1) Ir a la pestaña Actions → perf-jmeter → Run workflow.
2) Ajustar `users`, `ramp`, `duration` si se desea.
3) Al finalizar, descargar el artifact y revisar el resumen.

Resumen automático: `scripts/parse-jmeter.js` lee el `.jtl` y genera métricas (samples, tasa de éxito, latencias min/avg/p90/p95/p99/max) que se publican en el job.

### 8.2 Auditoría Lighthouse CI
Configuración en `lighthouserc.json` para auditar la build estática (`dist`) con preset de escritorio y umbrales mínimos por categoría (avisos si se incumplen):
- Performance ≥ 0.8
- Accessibility ≥ 0.9
- Best Practices ≥ 0.9
- SEO ≥ 0.9

Workflow: `.github/workflows/lighthouse.yml`
- Construye y sirve `dist` en `http://localhost:4173`.
- Ejecuta `treosh/lighthouse-ci-action` con el archivo `lighthouserc.json`.
- Sube artefactos y enlaces de almacenamiento temporal.

Para ejecutar: Actions → perf-lighthouse → Run workflow.

Cómo se aplicó
- Carga: plan JMeter (`perf/jmeter-test.jmx`) parametrizable que golpea la Home con usuarios concurrentes y rampa; guarda `.jtl` para análisis.
- Auditoría: `lighthouserc.json` con preset desktop y umbrales por categoría; URLs colectadas desde `dist`.

Cómo se integró
- Workflows `jmeter.yml` y `lighthouse.yml` construyen, sirven localmente `dist` y ejecutan las herramientas. Publican artefactos y resumen en el job.

Análisis de resultados
- Base esperada: sitio estático (Vite) debería ofrecer p95 de latencia muy bajo en Home y puntajes Lighthouse altos; los umbrales están como avisos para iterar sin bloquear.
- Los reportes quedan adjuntos por ejecución; permiten detectar regresiones de rendimiento o accesibilidad entre commits.

Notas:
- Ambos jobs trabajan sobre la build local para resultados reproducibles en PRs.
- Si se requiere probar contra un dominio público (Vercel/Pages), se puede extender el plan JMeter con variables de host y protocolo.

## 9. Pruebas de Aceptación

Esta fase valida que lo entregado cumple con los criterios funcionales y de calidad acordados (alineados a ISO/IEC 25010). Se compone de cuatro pasos:

1) Pruebas de Aceptación (ejecución de flujos principales)
- Navegación por Sidebar y rutas clave: Home, Robot 3D, Ciclo del Agua, Paleta de Colores.
- Interacciones esenciales: cambio de tema, controles de robot, etapas del ciclo del agua, selección de color/modelo.
- Respuesta perceptible < 200 ms en acciones clave.

2) Checklist de criterios de aceptación
- [ ] Contraste cumple umbrales (texto normal ≥ 4.5:1; grande ≥ 3:1)
- [ ] Foco visible y orden lógico de tabulación en todos los controles
- [ ] Navegación completada solo con teclado (Tab/Shift+Tab/Enter/Espacio/Escape)
- [ ] Labels y nombre accesible correctos; regiones semánticas nav/main/header
- [ ] Estados hover/focus/active consistentes en todos los botones/links
- [ ] Tiempos por tarea ≤ 2 min para 3 flujos representativos

3) Validación de cumplimiento funcional y de calidad
- Ejecutar la suite de pruebas: unitarias + integración (Jest)
- Opcional: correr Lighthouse (workflow perf-lighthouse) y adjuntar reporte
- Registrar evidencia (capturas/gifs breves) de los flujos críticos

4) Observaciones y mejoras
- Documentar hallazgos (críticos/serios/menores) y proponer acciones
- Crear issues por cada hallazgo con prioridad y criterios de cierre

Plantilla de evidencia mínima
- Caso probado, pasos, resultado esperado/obtenido, capturas y enlace a reporte (Lighthouse/JMeter)

Cómo se aplicó
- Se derivaron los criterios desde la sección de Requisitos No Funcionales (ISO/IEC 25010) y de los flujos educativos principales.
- Se combinaron evidencias automáticas (tests e informes) con verificación manual guiada por checklist.

Cómo se integró
- Las evidencias automáticas provienen de los jobs de CI y de los workflows de sistema; las manuales se anexan en issues o PRs.

Análisis de resultados
- Las pruebas automatizadas confirman el comportamiento esperado en flujos clave; el checklist ayuda a mantener foco en contraste, foco visible y teclado.
- Pendiente de ampliar con pruebas de lector de pantalla y cobertura completa de teclado en todas las vistas.

## 10. Pruebas de Implantación (Post-Deploy)

Verifican que el despliegue esté sano y que las funcionalidades operen en el entorno público (GitHub Pages o Vercel).

1) Verificación del despliegue
- Confirmar build exitoso y URL pública disponible
- Comprobar respuesta 200 en la Home y recursos principales (HTML/CSS/JS)
- Revisar consola del navegador: sin errores bloqueantes

2) Comprobación de funcionalidades en producción
- Navegación por todas las rutas; sin enlaces rotos ni 404
- Tema claro/oscuro persistente entre recargas
- Vistas 3D renderizan sin errores de WebGL en dispositivos de referencia
- Ciclo del Agua: etapas, reproducción automática y reinicio
- Paleta de Colores: presets, HEX válido y conmutación de modelo

3) Auditorías rápidas en producción (opcional)
- Lighthouse en la URL pública (Performance/A11y/Best Practices/SEO)
- Comparar contra umbrales del repositorio; registrar deriva si la hay

4) Registro de observaciones y plan de mejora
- Abrir issues con prioridad y responsable
- Anotar regresiones respecto a entorno local/preview

Cómo se aplicó
- Se definió un procedimiento de smoke tests posterior al despliegue (Pages o Vercel) centrado en disponibilidad, navegación y errores en consola.

Cómo se integró
- El workflow de Pages automatiza la construcción y publicación; tras cada deploy se sugiere ejecutar rápidamente Lighthouse sobre la URL pública.

Análisis de resultados
- Al trabajar con artefactos estáticos, los riesgos típicos son rutas/base y caché del navegador. El procedimiento mitiga estos casos y permite registrar regresiones visuales/funcionales.
