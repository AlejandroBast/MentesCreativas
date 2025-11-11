# Desarrollo Actividad

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
- MediaPlayer: reproductor de video con subtítulos *.vtt* y detección de completado.
- Quiz: opción múltiple con feedback inmediato.
- Progress: persistencia simple en localStorage para marcar video/3D/quiz completados.
- Controles accesibles: select, checkbox, range con *labels* y *foco visible*.

### 3.3 Flujos de usuario (resumen)
1. *Seleccionar tema* desde el Sidebar → se abre la vista.  
2. *Interactuar* (3D, sliders, toggles, bloques) con mouse *y* teclado.  
3. *Feedback inmediato* (<200 ms) y estilos consistentes (tokens de color/tipo/espaciado).  
4. (Opcional) *Video corto* con subtítulos.  
5. *Progreso* se guarda localmente.

### 3.4 Alineación a ISO/IEC 25010 (Usabilidad)
- *Estética UI:* tokens de diseño aplicados, contraste texto normal *≥4.5:1* / grande *≥3:1*, estados hover/focus/active coherentes.
- *Operabilidad:* navegación *solo con teclado* (Tab/Shift+Tab/Enter/Espacio/Escape), *foco visible* y orden lógico; sin trampas de foco.

### 3.5 Criterios de aceptación (frontend)
- *Exploración 3D:* cambiar *forma/color/escala*; ayuda “Rota/Zoom; Tab para controles”.  
- *Descomposición:* toggles accesibles; *conteos correctos* (6/12/8); estilos diferenciados.  
- *Simetría:* selector mariposa/estrella + ejes; foco visible en controles.  
- *Fracciones 3D:* sliders con límites (*2–12* y *0–den); muestra **fracción, decimal y %; actualización **<200 ms*.  
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




## 5 Punto

## 6 Punto