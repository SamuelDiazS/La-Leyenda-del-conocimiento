# PROYECTO: LA LEYENDA DEL CONOCIMIENTO
## Prompt maestro de desarrollo integral para Google Antigravity

Actúa como un equipo multidisciplinario de desarrollo de videojuegos MMORPG, ingeniería de software, diseño de videojuegos, narrativa, diseño de sistemas educativos y arquitectura de bases de datos.

Tu misión es diseñar y desarrollar un videojuego MMORPG educativo 2D llamado **La leyenda del conocimiento**.

No quiero una página web educativa tradicional, ni un dashboard con preguntas y respuestas, ni un juego de preguntas con elementos RPG superficiales.

Quiero un MMORPG de fantasía inspirado en World of Warcraft (WoW), con exploración, combate, progresión, razas, clases, habilidades, equipamiento, NPC, misiones, mazmorras, jefes, economía, personalización y un mundo persistente.

La diferencia fundamental es que el desarrollo del personaje estará vinculado al desarrollo de competencias necesarias para presentar las pruebas Saber 11 (ICFES) en Colombia.

Las áreas educativas principales serán:

1. Lectura crítica.
2. Matemáticas.
3. Física.

El videojuego debe ser divertido incluso cuando el jugador no esté realizando directamente una actividad educativa. Sin embargo, la progresión, las misiones, los territorios y los desafíos deben estar diseñados para desarrollar las competencias anteriores.

---

# 1. FILOSOFÍA Y PRINCIPIOS DEL JUEGO

El principio fundamental es:

**El conocimiento es poder dentro del universo del juego.**

No quiero mecánicas artificiales como:

- Sumar números para atacar.
- Resolver una operación para conseguir una espada.
- Contestar una pregunta de selección múltiple para derrotar instantáneamente a un enemigo.
- Completar cuestionarios tradicionales disfrazados de misiones.
- Interrumpir constantemente la exploración con ventanas educativas.

El conocimiento debe estar integrado naturalmente en las mecánicas.

Ejemplos:

LECTURA CRÍTICA:
- Investigar ruinas y reconstruir acontecimientos históricos.
- Interpretar manuscritos y textos antiguos.
- Descubrir contradicciones entre testimonios de NPC.
- Identificar intenciones, argumentos y evidencias.
- Descubrir engaños de personajes mediante el análisis de sus declaraciones.
- Interpretar símbolos y mensajes que contienen información necesaria para avanzar.

MATEMÁTICAS:
- Resolver mecanismos antiguos mediante patrones.
- Comprender proporciones para activar estructuras.
- Analizar coordenadas y mapas.
- Resolver problemas de optimización para encontrar rutas.
- Interpretar datos y relaciones matemáticas.
- Comprender funciones y comportamientos numéricos presentes en mecanismos del mundo.

FÍSICA:
- Manipular máquinas y mecanismos.
- Comprender trayectorias para activar dispositivos.
- Experimentar con poleas, palancas y sistemas de equilibrio.
- Utilizar conceptos de movimiento, fuerza, energía y electricidad.
- Resolver desafíos ambientales utilizando principios físicos.

Cada actividad debe enseñar o evaluar una competencia concreta del ICFES, pero sin romper la inmersión narrativa.

El jugador debe sentir que está jugando un MMORPG y no que está haciendo un examen.

---

# 2. TECNOLOGÍAS Y ARQUITECTURA

Construye una aplicación moderna, modular, escalable y preparada para producción.

Tecnologías recomendadas:

FRONTEND:
- Next.js con App Router.
- TypeScript.
- React.
- Tailwind CSS.
- Phaser 3 para el mundo 2D.
- Zustand para administrar el estado del juego.
- Sistema de componentes reutilizables.

BACKEND:
- Next.js Route Handlers o una arquitectura backend compatible con Vercel.
- TypeScript.
- Validación mediante Zod.
- API organizada por módulos.
- Autenticación segura mediante sesiones.

BASE DE DATOS:
- Neon PostgreSQL.
- Drizzle ORM o una solución equivalente.
- Archivo obligatorio schema.sql con toda la estructura de la base de datos.
- Migraciones versionadas.
- Relaciones e índices correctamente definidos.

DESPLIEGUE:
- Vercel.
- Neon como proveedor de PostgreSQL.
- Variables de entorno.
- Configuración de producción.
- Preparación para despliegues continuos desde GitHub.

MULTIJUGADOR:
Diseña una arquitectura que permita la existencia de un mundo compartido entre jugadores.

Considera que Vercel utiliza funciones serverless y no debe depender de procesos persistentes o servidores WebSocket tradicionales dentro de sus funciones.

Utiliza un proveedor de tiempo real compatible, como Ably, para:
- Presencia de jugadores.
- Posiciones de otros jugadores.
- Chat.
- Eventos de mundo.
- Grupos y actividades cooperativas.

La base de datos Neon debe conservar la información persistente.

Las operaciones importantes deben validarse en el servidor. Nunca confíes en el cliente para otorgar experiencia, monedas, objetos o progresión.

No simules un MMORPG multijugador si realmente no existe comunicación entre usuarios. Si alguna característica necesita una infraestructura adicional, implementa una integración real o documenta claramente su dependencia.

ESTRUCTURA:
Organiza el proyecto por módulos:

- auth/
- character/
- world/
- combat/
- abilities/
- races/
- classes/
- quests/
- learning/
- enemies/
- bosses/
- items/
- inventory/
- equipment/
- shops/
- economy/
- guilds/
- parties/
- dungeons/
- achievements/
- leaderboard/
- admin/
- database/
- realtime/

El código debe ser modular, tipado, documentado y mantenible.

Antes de comenzar, inspecciona el repositorio y su estructura. Si existe código previo, conserva lo útil y evita sobrescribir funcionalidades sin analizarlas.

---

# 3. IDENTIDAD VISUAL Y DIRECCIÓN ARTÍSTICA

Nombre oficial: LA LEYENDA DEL CONOCIMIENTO.

Diseña un MMORPG 2D con estética de fantasía medieval.

Referencias visuales:
- World of Warcraft.
- MMORPG clásicos.
- Fantasía medieval.
- Pixel art de alta calidad o ilustración 2D estilizada.
- Interfaz RPG con paneles ornamentados.
- Mapas con personalidad propia.
- Entornos visualmente diferenciados.

No copies recursos, personajes, nombres, mapas ni elementos protegidos de World of Warcraft. Utiliza su filosofía de diseño como inspiración, creando una identidad original.

El mundo debe sentirse vivo.

Implementa:
- Cámara con seguimiento del personaje.
- Escenarios con profundidad visual.
- Animaciones de movimiento.
- Animaciones de ataque.
- Efectos de habilidades.
- NPC con animaciones.
- Enemigos con comportamientos diferenciados.
- Elementos interactivos.
- Ciclo visual de día y noche.
- Interfaz de MMORPG.
- Minimap.
- Barra de habilidades.
- Inventario.
- Panel del personaje.
- Misiones activas.
- Indicadores de interacción.

El mundo debe ser navegable mediante teclado y mouse.

Controles sugeridos:
- WASD: movimiento.
- Mouse: selección e interacción.
- Clic derecho: acciones contextuales.
- Teclas 1-6: habilidades.
- E: interactuar.
- I: inventario.
- C: personaje.
- M: mapa.
- J: misiones.
- ESC: menú.

Implementa colisiones, límites del escenario y zonas de transición.

No utilices simplemente una imagen de fondo con un personaje superpuesto. Debe existir un verdadero sistema de juego 2D.

---

# 4. NARRATIVA Y UNIVERSO

Desarrolla una narrativa original y extensa.

## El mundo: Aethoria

Aethoria fue un mundo construido sobre tres grandes fuerzas:

- La Memoria: representa la interpretación, la comprensión y el pensamiento crítico.
- La Razón: representa las matemáticas, los patrones y las relaciones lógicas.
- La Energía: representa las leyes físicas que mantienen el universo en funcionamiento.

Durante siglos, estas tres fuerzas mantuvieron el equilibrio.

Sin embargo, una entidad conocida como El Vacío comenzó a destruir el conocimiento del mundo.

No destruye únicamente libros o estructuras: altera los recuerdos, distorsiona las relaciones lógicas y rompe las leyes que gobiernan la naturaleza.

Los habitantes comenzaron a olvidar acontecimientos, interpretar incorrectamente los mensajes y perder la capacidad de comprender los mecanismos de su propio mundo.

El resultado fue la aparición de criaturas conocidas como los Desmemoriados.

El jugador es un Viajero del Conocimiento, una persona que conserva la capacidad de comprender aquello que el resto del mundo ha olvidado.

Su objetivo será recuperar los fragmentos del conocimiento, reconstruir las tres fuerzas fundamentales y descubrir quién está detrás de la corrupción de Aethoria.

## Narrativa principal

Divide la historia en capítulos:

CAPÍTULO I: El despertar.
- Creación del personaje.
- Tutorial narrativo.
- Descubrimiento de los primeros poderes.
- Conocimiento del mundo.
- Primera misión importante.

CAPÍTULO II: Las tierras olvidadas.
- Exploración de nuevas regiones.
- Investigación de ruinas.
- Primeras mazmorras.
- Descubrimiento de las primeras contradicciones sobre el origen del Vacío.

CAPÍTULO III: El reino de los mecanismos.
- Grandes estructuras.
- Máquinas antiguas.
- Desafíos matemáticos y físicos.
- Descubrimiento de una civilización desaparecida.

CAPÍTULO IV: La biblioteca de las verdades.
- Investigación de documentos.
- Personajes con versiones contradictorias de la historia.
- Descubrimiento de secretos.
- Misiones centradas en lectura crítica.

CAPÍTULO V: La fractura.
- Mazmorras avanzadas.
- Jefes.
- Actividades cooperativas.
- Descubrimiento de la verdadera naturaleza del Vacío.

CAPÍTULO VI: El último conocimiento.
- Gran conflicto final.
- Recuperación de los fragmentos.
- Decisiones narrativas.
- Conclusión de la historia principal.

La historia debe desarrollarse mediante diálogos, cinemáticas 2D, documentos, eventos y misiones.

Los desafíos educativos deben estar incorporados en los acontecimientos.

---

# 5. RAZAS

Implementa un sistema de razas con identidad visual, historia, características y habilidades raciales.

Razas iniciales:

1. Humanos de Aethoria.
   - Equilibrados.
   - Adaptabilidad.
   - Especialización flexible.

2. Elfos de Lunaria.
   - Afinidad con la memoria.
   - Percepción.
   - Interpretación de conocimientos antiguos.

3. Enanos de Forjaterra.
   - Afinidad con mecanismos.
   - Ingeniería.
   - Comprensión de estructuras.

4. Dracónidos.
   - Afinidad con la energía.
   - Resistencia.
   - Dominio de fenómenos naturales.

5. Sylvanos.
   - Afinidad con la naturaleza.
   - Equilibrio.
   - Comprensión de patrones ambientales.

Cada raza debe disponer de:
- Modelo visual.
- Variantes de apariencia.
- Historia.
- Características.
- Habilidad racial activa.
- Habilidad racial pasiva.
- Animaciones propias cuando corresponda.

Las razas deben ser diferentes sin crear desequilibrios que obliguen a elegir una sola opción.

---

# 6. CLASES Y ROLES

Diseña un sistema de clases inspirado en los MMORPG tradicionales.

Clases iniciales:

1. GUARDIÁN.
   - Rol: tanque.
   - Resistencia y protección.
   - Control de enemigos.

2. ARCANISTA.
   - Rol: daño mágico.
   - Dominio de energía.
   - Habilidades de área.

3. EXPLORADOR.
   - Rol: daño a distancia.
   - Movilidad.
   - Precisión y reconocimiento.

4. INVOCADOR.
   - Rol: invocación y apoyo.
   - Criaturas aliadas.
   - Control del campo de batalla.

5. INGENIERO RÚNICO.
   - Rol: daño y utilidad.
   - Construcción de dispositivos.
   - Trampas y mecanismos.

6. ERUDITO.
   - Rol: soporte.
   - Conocimiento.
   - Protección, análisis y debilitamiento de enemigos.

Cada clase debe tener:
- Historia.
- Identidad visual.
- Árbol de habilidades.
- Habilidades activas.
- Habilidades pasivas.
- Especializaciones.
- Recursos propios.
- Animaciones.
- Progresión.

Implementa especializaciones desbloqueables.

Ejemplo:

GUARDIÁN:
- Bastión.
- Vanguardia.
- Protector rúnico.

ARCANISTA:
- Dominio elemental.
- Manipulación espacial.
- Energía ancestral.

El jugador debe poder construir personajes diferentes incluso cuando pertenecen a la misma clase.

---

# 7. SISTEMA DE HABILIDADES

Crea un sistema profundo de habilidades.

Cada personaje debe tener:
- Nivel.
- Experiencia.
- Atributos.
- Puntos de habilidad.
- Árbol de talentos.
- Habilidades desbloqueables.
- Especializaciones.
- Habilidades raciales.
- Habilidades de clase.

Atributos:
- Fuerza.
- Inteligencia.
- Agilidad.
- Resistencia.
- Percepción.
- Sabiduría.

Las habilidades deben tener:
- Nombre.
- Descripción.
- Icono.
- Animación.
- Tiempo de reutilización.
- Coste de recurso.
- Rango.
- Nivel requerido.
- Efectos.
- Requisitos de desbloqueo.

Implementa una barra de habilidades personalizable.

El jugador debe poder elegir cuáles habilidades utiliza y en qué orden.

## Integración educativa

La progresión de habilidades debe relacionarse con el dominio de competencias.

Ejemplo:

Una habilidad de investigación puede desbloquearse al demostrar comprensión de argumentos y evidencias.

Una habilidad de manipulación espacial puede evolucionar mediante desafíos de razonamiento matemático.

Una habilidad de control energético puede mejorar mediante la resolución de situaciones relacionadas con fenómenos físicos.

No hagas que el jugador deba resolver una pregunta para activar cada habilidad en combate.

El aprendizaje debe desbloquear nuevas posibilidades, mejorar capacidades y permitir superar desafíos cada vez más complejos.

---

# 8. PERSONALIZACIÓN DEL PERSONAJE

Cada usuario debe poder personalizar completamente su personaje.

Implementa:
- Selección de raza.
- Selección de clase.
- Sexo o presentación visual configurable, sin restricciones innecesarias.
- Rostro.
- Cabello.
- Color de cabello.
- Tono de piel.
- Ojos.
- Vestimenta.
- Armadura.
- Armas.
- Accesorios.
- Mascotas acompañantes.
- Monturas.
- Efectos visuales.

El equipamiento debe modificar la apariencia del personaje.

No quiero que la personalización sea únicamente una lista de opciones de texto.

Debe existir una vista previa visual del personaje.

La apariencia y la configuración de habilidades deben guardarse en Neon.

---

# 9. SISTEMA DE PROGRESIÓN

Implementa:

- Nivel del personaje.
- Experiencia.
- Niveles de clase.
- Puntos de talento.
- Reputación.
- Logros.
- Títulos.
- Equipamiento.
- Desbloqueo de zonas.
- Dominio de competencias educativas.

La progresión debe ser prolongada y ofrecer objetivos constantes.

Incluye:
- Niveles de personaje.
- Rangos de equipamiento.
- Rarezas.
- Conjuntos de armadura.
- Recompensas por exploración.
- Recompensas por misiones.
- Recompensas por jefes.
- Recompensas por logros.

Rarezas:
- Común.
- Poco común.
- Raro.
- Épico.
- Legendario.
- Mítico.

No permitas que un jugador consiga todo rápidamente.

Implementa límites y controles contra la repetición abusiva de recompensas.

---

# 10. SISTEMA EDUCATIVO INTEGRADO

Este es uno de los módulos más importantes.

Diseña un sistema de aprendizaje basado en competencias y alineado con el enfoque de las pruebas Saber 11 del ICFES colombiano.

No conviertas el juego en un banco de preguntas tradicional.

Las actividades deben utilizar situaciones narrativas y contextuales.

## A. LECTURA CRÍTICA

Competencias:
- Identificar información explícita.
- Comprender relaciones entre partes de un texto.
- Identificar ideas principales.
- Reconocer intenciones comunicativas.
- Analizar argumentos.
- Diferenciar hechos y opiniones.
- Identificar supuestos.
- Inferir información.
- Evaluar la validez de argumentos.
- Relacionar diferentes perspectivas.

Mecánicas:
- Investigación.
- Reconstrucción de acontecimientos.
- Análisis de documentos.
- Interrogatorios.
- Descubrimiento de contradicciones.
- Interpretación de mensajes.
- Resolución de misterios.

Ejemplo:

En una aldea han desaparecido varios objetos.

Tres personajes presentan testimonios diferentes.

El jugador debe investigar documentos, comparar declaraciones, reconocer contradicciones y reconstruir lo sucedido.

La actividad evalúa lectura crítica sin presentarse como un cuestionario.

## B. MATEMÁTICAS

Competencias:
- Interpretación y representación.
- Formulación y ejecución.
- Argumentación.

Contenidos:
- Números reales.
- Operaciones.
- Razones y proporciones.
- Porcentajes.
- Álgebra.
- Ecuaciones.
- Funciones.
- Geometría.
- Estadística.
- Probabilidad.
- Interpretación de gráficas.
- Modelación matemática.

Mecánicas:
- Construcción de mecanismos.
- Interpretación de mapas.
- Sistemas de coordenadas.
- Patrones.
- Relaciones entre variables.
- Optimización de recursos.
- Análisis de datos del mundo.

Ejemplo:

El jugador encuentra un antiguo sistema de compuertas.

Debe comprender las relaciones entre los mecanismos y descubrir cómo funcionan para restaurar el suministro de agua de una ciudad.

## C. FÍSICA

Contenidos:
- Cinemática.
- Movimiento rectilíneo.
- Velocidad.
- Aceleración.
- Fuerzas.
- Leyes de Newton.
- Trabajo y energía.
- Potencia.
- Conservación de la energía.
- Movimiento parabólico.
- Ondas.
- Sonido.
- Óptica.
- Electricidad.
- Circuitos.
- Magnetismo.
- Termodinámica.

Mecánicas:
- Máquinas antiguas.
- Sistemas de poleas.
- Palancas.
- Mecanismos.
- Energía.
- Trayectorias.
- Dispositivos eléctricos.
- Desafíos ambientales.

Ejemplo:

El jugador encuentra una estructura que necesita energía para abrirse.

Debe investigar su funcionamiento, experimentar con los elementos disponibles y comprender los principios físicos involucrados.

## SISTEMA DE DIFICULTAD

Las actividades deben tener niveles:

- Principiante.
- Intermedio.
- Avanzado.
- Experto.

Adapta progresivamente la dificultad al desempeño del jugador.

Implementa un sistema de diagnóstico que identifique:
- Competencias dominadas.
- Competencias con dificultades.
- Errores recurrentes.
- Tiempo de resolución.
- Evolución histórica.
- Recomendaciones de actividades.

No repitas constantemente la misma pregunta.

---

# 11. GENERACIÓN PROCEDIMENTAL DE MISIONES

Desarrolla un sistema de misiones dinámico.

Las misiones deben generarse combinando plantillas narrativas, objetivos, escenarios, NPC, enemigos y desafíos educativos previamente definidos y validados.

No generes preguntas educativas aleatorias sin verificar su respuesta.

La generación debe utilizar un catálogo de actividades revisadas y un sistema de parámetros para adaptar su contexto, dificultad y presentación.

Tipos de misiones:

- Exploración.
- Investigación.
- Combate.
- Recuperación de artefactos.
- Escolta.
- Resolución de misterios.
- Restauración de estructuras.
- Misiones de facción.
- Misiones diarias.
- Misiones semanales.
- Misiones de historia.
- Mazmorras.

Cada misión debe incluir:

- Identificador.
- Nombre.
- Descripción narrativa.
- Contexto.
- NPC relacionado.
- Ubicación.
- Objetivos.
- Requisitos.
- Dificultad.
- Competencias educativas involucradas.
- Recompensas.
- Experiencia.
- Monedas.
- Objetos.
- Reputación.

Ejemplo:

MISIÓN: Los secretos de la torre silenciosa.

Un investigador desapareció mientras estudiaba una antigua biblioteca.

El jugador debe encontrar documentos, comparar testimonios y descubrir qué sucedió.

Durante la exploración encontrará enemigos, mecanismos y desafíos.

Al finalizar, obtiene experiencia, reputación, monedas y un objeto especial.

El sistema debe registrar las competencias desarrolladas durante la misión.

Implementa generación procedural controlada para que las misiones puedan variar sin perder coherencia narrativa.

---

# 12. ENEMIGOS Y COMBATE

Diseña un sistema de combate 2D en tiempo real.

El personaje debe poder:
- Moverse.
- Atacar.
- Utilizar habilidades.
- Esquivar.
- Recibir daño.
- Aplicar efectos.
- Interactuar con el entorno.
- Obtener experiencia.

Implementa:
- Detección de colisiones.
- Rangos de ataque.
- Animaciones.
- Cooldowns.
- Barras de vida.
- Estados de combate.
- IA de enemigos.
- Comportamientos diferenciados.
- Sistema de aggro.
- Recompensas.

El combate debe ser interesante y requerir estrategia.

No todas las criaturas deben enfrentarse de la misma manera.

Ejemplos de enemigos:

- Desmemoriados.
- Guardianes de piedra.
- Constructos rúnicos.
- Sombras del Vacío.
- Bestias de energía.
- Devoradores de recuerdos.

Cada enemigo debe tener:
- Apariencia.
- Historia.
- Nivel.
- Estadísticas.
- Habilidades.
- Comportamiento.
- Debilidades.
- Recompensas.

## JEFES

Diseña jefes con varias fases.

Ejemplos:

1. El Guardián de los Ecos.
   - Enfoque: lectura crítica.
   - Sus ataques alteran la percepción del entorno.
   - El jugador debe interpretar pistas para identificar los patrones reales.

2. El Arquitecto de las Proporciones.
   - Enfoque: matemáticas.
   - Utiliza estructuras y mecanismos.
   - El escenario cambia durante el combate.

3. La Bestia de la Fractura.
   - Enfoque: física.
   - Manipula fuerzas y energía.
   - El jugador debe aprovechar el comportamiento del entorno.

4. El Bibliotecario del Vacío.
   - Jefe de historia.
   - Combina las tres áreas.
   - Tiene diferentes fases y mecánicas.

Las mecánicas educativas deben formar parte del escenario y del comportamiento de los jefes, no convertirse en ventanas de preguntas durante el combate.

---

# 13. ZONAS Y MUNDO ABIERTO

Diseña un mundo compuesto por diferentes regiones.

ZONAS INICIALES:

1. Valle de los Despertares.
   - Zona inicial.
   - Tutorial.
   - Enemigos básicos.
   - Primeros NPC.

2. Bosque de Lunaria.
   - Lectura crítica.
   - Ruinas.
   - Misterios.
   - Criaturas mágicas.

3. Forjaterra.
   - Matemáticas.
   - Construcciones.
   - Mecanismos.
   - Sistemas de ingeniería.

4. Llanuras de Ignis.
   - Física.
   - Energía.
   - Movimiento.
   - Fenómenos naturales.

5. Biblioteca de las Verdades.
   - Investigación.
   - Textos.
   - Interpretación.
   - Misiones narrativas.

6. Montañas del Olvido.
   - Enemigos avanzados.
   - Mazmorras.
   - Jefes.

7. Ciudadela del Vacío.
   - Zona final.
   - Contenido avanzado.
   - Jefe final.

Cada región debe tener:
- Mapa.
- Biomas.
- Música.
- NPC.
- Enemigos.
- Recursos.
- Misiones.
- Secretos.
- Lugares de interés.
- Mazmorras.
- Eventos.

Implementa transiciones entre mapas y zonas.

El mundo debe tener una distribución coherente y ofrecer exploración real.

---

# 14. NPC Y SISTEMA DE DIÁLOGOS

Crea NPC con personalidad e historia.

Tipos:
- Comerciantes.
- Entrenadores.
- Investigadores.
- Herreros.
- Alquimistas.
- Guardianes.
- Narradores.
- Líderes de facción.
- Personajes de misiones.

Cada NPC debe disponer de:
- Nombre.
- Apariencia.
- Ubicación.
- Diálogos.
- Funciones.
- Misiones.
- Relaciones con otros NPC.

Implementa diálogos con opciones.

Las decisiones pueden afectar:
- Reputación.
- Misiones.
- Recompensas.
- Relaciones.
- Desarrollo narrativo.

Algunos diálogos deben incorporar competencias de lectura crítica mediante la interpretación de información y las decisiones fundamentadas.

---

# 15. INVENTARIO, OBJETOS Y TIENDAS

Implementa un inventario completo.

Categorías:
- Armas.
- Armaduras.
- Cascos.
- Botas.
- Guantes.
- Accesorios.
- Pociones.
- Materiales.
- Objetos de misión.
- Artefactos.
- Mascotas.
- Monturas.

Cada objeto debe tener:
- Nombre.
- Descripción.
- Icono.
- Rareza.
- Tipo.
- Estadísticas.
- Nivel requerido.
- Valor.
- Efectos.

Implementa:
- Equipamiento.
- Desequipamiento.
- Comercio.
- Almacenamiento.
- Tiendas.
- Compra.
- Venta.
- Moneda del juego.

El inventario debe tener capacidad configurable y permitir organizar los objetos.

Las tiendas deben pertenecer a NPC específicos.

Implementa una economía equilibrada, con mecanismos para evitar duplicación de monedas y objetos.

---

# 16. MULTIJUGADOR Y ELEMENTOS SOCIALES

El objetivo es crear un mundo compartido.

Implementa progresivamente:

- Otros jugadores visibles en el mapa.
- Nombre sobre el personaje.
- Chat global.
- Chat privado.
- Grupos.
- Invitaciones.
- Mazmorras cooperativas.
- Jefes grupales.
- Gremios.
- Clasificaciones.
- Eventos del mundo.

Los jugadores deben poder colaborar para superar desafíos.

La cooperación debe aportar valor educativo.

Por ejemplo, una mazmorra puede distribuir diferentes responsabilidades entre los integrantes del grupo, obligándolos a interpretar pistas, comprender mecanismos y coordinar soluciones.

Evita que un jugador pueda obtener recompensas sin participar realmente.

---

# 17. ADMINISTRACIÓN

Construye un panel de administrador completo, separado de la interfaz del videojuego.

Debe existir una cuenta inicial de administración con estas credenciales:

Usuario: Fredy

Contraseña inicial: Admin_JL2026

IMPORTANTE:
Estas credenciales deben utilizarse exclusivamente para crear la cuenta inicial de administrador mediante un proceso seguro de inicialización.

No almacenes la contraseña en texto plano ni la incluyas en el código frontend.

Implementa:
- Hash seguro de contraseñas.
- Variables de entorno para la configuración inicial.
- Protección de rutas administrativas.
- Control de roles.
- Sesiones seguras.
- Validación en servidor.
- Cambio obligatorio de contraseña inicial.
- Protección contra fuerza bruta.

## FUNCIONALIDADES DEL PANEL

### Dashboard

Mostrar:
- Usuarios registrados.
- Usuarios activos.
- Usuarios conectados.
- Total de personajes.
- Distribución por razas.
- Distribución por clases.
- Nivel promedio.
- Tiempo de juego.
- Misiones completadas.
- Actividades educativas realizadas.
- Progreso general.

### Gestión de usuarios

El administrador debe poder:
- Consultar todos los usuarios.
- Buscar por nombre.
- Consultar perfiles.
- Consultar personajes.
- Ver raza y clase.
- Ver nivel.
- Ver experiencia.
- Ver inventario.
- Ver equipamiento.
- Ver monedas.
- Ver habilidades.
- Ver misiones.
- Ver logros.
- Consultar actividad reciente.
- Consultar progreso educativo.

### Seguimiento educativo

Debe existir una sección que permita visualizar:

- Desempeño en lectura crítica.
- Desempeño en matemáticas.
- Desempeño en física.
- Competencias dominadas.
- Competencias pendientes.
- Errores frecuentes.
- Tiempo empleado.
- Evolución del desempeño.
- Historial de actividades.
- Dificultad de las actividades realizadas.

Incorpora gráficas para analizar el rendimiento.

### Gestión del mundo

Permite administrar:
- Misiones.
- NPC.
- Enemigos.
- Jefes.
- Objetos.
- Tiendas.
- Zonas.
- Eventos.
- Recompensas.

### Gestión educativa

Permite:
- Crear actividades.
- Editar actividades.
- Eliminar actividades.
- Clasificar por área.
- Clasificar por competencia.
- Configurar dificultad.
- Establecer respuestas correctas.
- Crear explicaciones.
- Consultar estadísticas.
- Activar y desactivar contenidos.

### Auditoría

Registra:
- Inicio de sesión.
- Cambios administrativos.
- Modificaciones de inventario.
- Otorgamiento de recompensas.
- Cambios de nivel.
- Acciones importantes.

El administrador debe poder consultar información detallada sin acceder a contraseñas ni datos secretos de autenticación.

---

# 18. BASE DE DATOS NEON

Es obligatorio crear un archivo:

schema.sql

Este archivo debe contener toda la estructura necesaria para construir la base de datos desde cero.

Diseña un esquema relacional completo.

Incluye tablas para:

AUTENTICACIÓN:
- users
- user_sessions
- roles
- user_roles

PERSONAJES:
- characters
- character_appearance
- races
- character_classes
- character_attributes
- character_skills
- skill_definitions
- skill_trees
- skill_points

MUNDO:
- world_zones
- world_maps
- world_locations
- npc
- npc_dialogues
- enemies
- bosses
- enemy_drops

MISIONES:
- quests
- quest_objectives
- character_quests
- quest_rewards

EDUCACIÓN:
- learning_areas
- learning_competencies
- learning_topics
- learning_activities
- learning_questions
- learning_options
- learning_attempts
- learning_progress
- competency_progress

INVENTARIO:
- items
- character_inventory
- character_equipment
- shops
- shop_inventory
- transactions
- currencies

PROGRESIÓN:
- achievements
- character_achievements
- reputation
- character_reputation

MULTIJUGADOR:
- guilds
- guild_members
- parties
- party_members
- chat_messages
- player_presence

ADMINISTRACIÓN:
- audit_logs
- game_events
- admin_settings

No es necesario utilizar exactamente estos nombres si existe una razón arquitectónica para modificarlos, pero todas las funcionalidades deben tener persistencia real.

Requisitos:
- Claves primarias.
- Claves foráneas.
- Restricciones.
- Índices.
- Campos created_at y updated_at cuando corresponda.
- Integridad referencial.
- Tipos adecuados.
- Restricciones para evitar duplicaciones.
- Relaciones coherentes.

Utiliza transacciones para operaciones críticas.

No guardes el inventario completo, las habilidades y el progreso en una única columna JSON si eso impide consultarlos y administrarlos correctamente.

Puedes utilizar JSONB para atributos flexibles y configuraciones de apariencia cuando esté justificado.

El esquema debe ser compatible con PostgreSQL de Neon.

Incluye datos iniciales mediante un seed.sql o mecanismo equivalente:
- Razas.
- Clases.
- Habilidades.
- Objetos.
- Enemigos.
- Zonas.
- NPC.
- Competencias.
- Misiones iniciales.

La aplicación debe poder inicializarse siguiendo instrucciones claras.

---

# 19. SEGURIDAD

Implementa medidas reales de seguridad:

- Contraseñas con Argon2id o bcrypt.
- Protección de sesiones.
- Cookies HttpOnly y Secure en producción.
- Validación de entradas.
- Protección de endpoints.
- Control de permisos.
- Protección de operaciones económicas.
- Rate limiting.
- Protección contra SQL injection.
- Protección contra XSS.
- Validación de recompensas en backend.
- Prevención de duplicación de objetos.
- Prevención de modificación de experiencia desde el cliente.

Los usuarios normales nunca deben acceder a información administrativa.

No expongas:
- DATABASE_URL.
- Credenciales.
- Secretos.
- Tokens privados.
- Información de autenticación.

El panel de administración debe verificar los permisos en el servidor, no solamente ocultar botones en el frontend.

---

# 20. EXPERIENCIA DE USUARIO

Diseña una interfaz que transmita la sensación de estar jugando un MMORPG.

Pantallas:

1. Inicio.
2. Registro.
3. Inicio de sesión.
4. Creación de personaje.
5. Selección de raza.
6. Selección de clase.
7. Personalización.
8. Mundo principal.
9. Inventario.
10. Personaje.
11. Habilidades.
12. Misiones.
13. Mapa.
14. Tiendas.
15. NPC.
16. Logros.
17. Estadísticas educativas.
18. Gremios.
19. Mazmorras.
20. Panel de administración.

La interfaz principal del juego debe contener:

- Mundo 2D.
- Barra de vida.
- Barra de recursos.
- Nivel.
- Experiencia.
- Habilidades.
- Minimap.
- Misiones activas.
- Chat.
- Inventario.
- Acceso al personaje.

No quiero una interfaz moderna genérica de SaaS.

Debe parecer la interfaz de un videojuego RPG.

---

# 21. SISTEMA DE GUARDADO

Todo progreso importante debe persistir en Neon.

Guardar:
- Cuenta.
- Personaje.
- Apariencia.
- Clase.
- Raza.
- Nivel.
- Experiencia.
- Atributos.
- Habilidades.
- Equipamiento.
- Inventario.
- Monedas.
- Misiones.
- Logros.
- Reputación.
- Progreso educativo.
- Historial de actividades.

El jugador debe poder cerrar sesión y volver posteriormente sin perder el progreso.

Implementa autoguardado para las acciones importantes.

Evita realizar escrituras innecesarias a la base de datos en cada fotograma del juego.

---

# 22. RENDIMIENTO Y CALIDAD

El juego debe funcionar correctamente en navegadores modernos.

Optimiza:
- Carga de recursos.
- Spritesheets.
- Animaciones.
- Renderizado.
- Consultas SQL.
- Peticiones de API.
- Comunicación multijugador.

Implementa:
- Lazy loading.
- Carga progresiva de mapas.
- Optimización de imágenes.
- Gestión de recursos.
- Manejo de errores.
- Estados de carga.
- Mensajes de error comprensibles.

El juego debe ser responsive en sus interfaces, aunque la experiencia principal de MMORPG esté optimizada para PC.

---

# 23. ORGANIZACIÓN DEL DESARROLLO

No desarrolles todo como un único archivo.

Divide el trabajo en fases.

FASE 1: FUNDAMENTOS
- Configuración del proyecto.
- Arquitectura.
- Base de datos.
- Autenticación.
- Registro.
- Inicio de sesión.
- Creación de personaje.
- Sistema de razas y clases.

FASE 2: MOTOR DEL JUEGO
- Phaser 3.
- Mundo 2D.
- Movimiento.
- Colisiones.
- Cámara.
- Animaciones.
- Interacción.

FASE 3: RPG
- Atributos.
- Niveles.
- Experiencia.
- Habilidades.
- Inventario.
- Equipamiento.
- Objetos.

FASE 4: CONTENIDO
- NPC.
- Diálogos.
- Misiones.
- Enemigos.
- Combate.
- Jefes.
- Zonas.
- Tiendas.

FASE 5: APRENDIZAJE
- Lectura crítica.
- Matemáticas.
- Física.
- Competencias ICFES.
- Actividades.
- Progreso.
- Adaptación de dificultad.

FASE 6: MULTIJUGADOR
- Presencia.
- Chat.
- Grupos.
- Gremios.
- Mazmorras cooperativas.

FASE 7: ADMINISTRACIÓN
- Dashboard.
- Usuarios.
- Personajes.
- Seguimiento educativo.
- Gestión del contenido.
- Auditoría.

FASE 8: PRODUCCIÓN
- Pruebas.
- Optimización.
- Seguridad.
- Despliegue en Vercel.
- Configuración de Neon.
- Documentación.

Cada fase debe terminar con una versión funcional y verificable.

No avances dejando errores fundamentales de fases anteriores.

---

# 24. REQUISITOS DE ENTREGA

El resultado debe ser un proyecto funcional, no una maqueta.

Debes entregar:

1. Código fuente completo.
2. Estructura modular.
3. schema.sql.
4. seed.sql.
5. Archivo .env.example.
6. Configuración de Vercel.
7. Configuración de Neon.
8. Sistema de autenticación.
9. Sistema de administración.
10. Mundo 2D jugable.
11. Sistema RPG.
12. Sistema educativo.
13. Contenido inicial.
14. Documentación de instalación.
15. Documentación de despliegue.

Crea un README.md con instrucciones precisas.

Incluye las variables de entorno necesarias, por ejemplo:

DATABASE_URL=
SESSION_SECRET=
INITIAL_ADMIN_USERNAME=Fredy
INITIAL_ADMIN_PASSWORD=
ABLY_API_KEY=

No incluyas secretos reales en el repositorio.

La contraseña inicial debe introducirse mediante una variable de entorno y almacenarse únicamente después de aplicar un hash seguro.

---

# 25. CRITERIOS DE ACEPTACIÓN

El proyecto no se considerará funcional hasta cumplir lo siguiente:

1. Un usuario puede registrarse e iniciar sesión.
2. Un usuario puede crear un personaje.
3. Puede elegir una raza y una clase.
4. Puede personalizar su apariencia.
5. Puede entrar en un escenario 2D.
6. Puede moverse libremente.
7. Puede interactuar con NPC.
8. Puede combatir contra enemigos.
9. Puede utilizar habilidades.
10. Puede conseguir objetos.
11. Puede utilizar un inventario.
12. Puede aceptar y completar misiones.
13. Puede desarrollar competencias educativas.
14. Puede subir de nivel.
15. Puede guardar su progreso.
16. Puede cerrar sesión y recuperar su personaje.
17. El administrador puede consultar los usuarios.
18. El administrador puede visualizar el progreso educativo.
19. La información está almacenada en Neon.
20. La aplicación puede desplegarse en Vercel.
21. Los sistemas multijugador implementados funcionan realmente y no son solamente interfaces simuladas.

---

# 26. INSTRUCCIONES FINALES PARA ANTIGRAVITY

Trabaja como un desarrollador senior responsable de entregar un producto real.

Prioriza la calidad del videojuego.

No sacrifiques la jugabilidad por incorporar más contenido educativo.

No sacrifiques la arquitectura por desarrollar rápidamente una demostración.

No utilices datos ficticios para simular funcionalidades que deberían estar conectadas a la base de datos.

No dejes botones decorativos sin funcionalidad.

No utilices interfaces que parezcan un prototipo genérico.

No inventes funcionalidades supuestamente terminadas.

Cuando una funcionalidad dependa de servicios externos, implementa correctamente su integración o documenta la dependencia.

Antes de desarrollar, establece la arquitectura completa, el modelo de datos y el plan de implementación.

Después, comienza a desarrollar el proyecto por fases, verificando cada módulo.

Si una fase es demasiado extensa, divídela en subtareas y continúa hasta terminarla.

Realiza pruebas de integración entre módulos.

Verifica que el juego, el backend y Neon trabajen conjuntamente.

Mantén actualizada la documentación.

**OBJETIVO FINAL:**

Crear un MMORPG 2D llamado LA LEYENDA DEL CONOCIMIENTO, con una experiencia de juego profunda inspirada en los MMORPG clásicos, en el que los jugadores puedan explorar un mundo fantástico, crear personajes únicos, desarrollar habilidades, combatir, descubrir historias, colaborar con otros jugadores y progresar mientras fortalecen sus competencias de lectura crítica, matemáticas y física para las pruebas Saber 11 del ICFES.

El jugador debe entrar porque quiere jugar y permanecer porque quiere descubrir qué hay más allá del siguiente territorio.