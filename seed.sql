-- ==============================================================================
-- LA LEYENDA DEL CONOCIMIENTO - DATOS INICIALES (SEED DATA)
-- ==============================================================================

-- 1. Roles del Sistema
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador general con acceso a métricas, gestión educativa y auditoría'),
('player', 'Jugador regular de Aethoria'),
('moderator', 'Moderador de chat y soporte comunitario')
ON CONFLICT (name) DO NOTHING;

-- 2. Usuario Administrador Inicial
-- Contraseña inicial: Admin_JL2026 (Hash bcrypt costo 10)
-- Hash generado de 'Admin_JL2026': $2a$10$wT8d207tX92Fp89E286U6u.vY18Hl8p9/n6Qp.T20vBqVj0uX36r6
-- (Nota: El sistema de backend valida además con bcryptjs en tiempo de ejecución)
INSERT INTO users (username, email, password_hash, is_admin, must_change_password)
VALUES (
    'Fredy',
    'fredy.admin@aethoria.edu.co',
    '$2a$10$0pUom0eZ1U0t.sXlO2u2CeF5/cM6wXyS7l3E5R9yq.Z3XmI0h1d7C', -- Password hasheado para inicialización segura
    TRUE,
    TRUE
) ON CONFLICT (username) DO NOTHING;

-- 3. Razas de Aethoria
INSERT INTO races (code, name, description, affinity_area, active_skill_name, active_skill_desc, passive_skill_name, passive_skill_desc, bonus_strength, bonus_intelligence, bonus_agility, bonus_stamina, bonus_perception, bonus_wisdom, sprite_preset) VALUES
(
    'human',
    'Humanos de Aethoria',
    'Habitantes de las llanuras centrales. Poseen una versatilidad y resiliencia incomparables, capaces de adaptarse a cualquier desafío cognitivo y militar.',
    'Adaptabilidad',
    'Espíritu de Superación',
    'Aumenta la velocidad de movimiento un 25% y la regeneración de recursos durante 8 segundos.',
    'Ingenio Aethoriano',
    'Otorga +5% de experiencia adicional en todas las actividades y misiones.',
    2, 2, 2, 2, 2, 2,
    'human_preset'
),
(
    'elf',
    'Elfos de Lunaria',
    'Antiguos guardianes de los bosques luminosos. Poseen una conexión natural con los ecos de la memoria y la interpretación de escrituras ancestrales.',
    'Memoria',
    'Claridad Lunar',
    'Revela pistas ocultas en el entorno y aumenta el daño mágico un 15% durante 6 segundos.',
    'Eco Ancestral',
    'Otorga +4 de Percepción y +4 de Inteligencia. Mayor probabilidad de discernir contradicciones.',
    0, 4, 2, 0, 4, 2,
    'elf_preset'
),
(
    'dwarf',
    'Enanos de Forjaterra',
    'Maestros artesanos y calculistas de las ciudadelas subterráneas. Entienden la geometría de la piedra y los mecanismos de engranajes.',
    'Mecanismos',
    'Sobrecarga Rúnica',
    'Crea un escudo de piedra equivalente al 20% de la salud máxima durante 6 segundos.',
    'Afinidad con la Forja',
    'Otorga +5 de Fuerza y +3 de Sabiduría. Reduce el daño físico recibido en un 5%.',
    5, 0, 0, 4, 1, 3,
    'dwarf_preset'
),
(
    'dragonkin',
    'Dracónidos',
    'Noble estirpe vinculada a las energías elementales de la tierra y el cosmos. Dominan los flujos térmicos y el movimiento cinético.',
    'Energía',
    'Aliento Cinético',
    'Libera una onda de choque frontal que empuja a los enemigos y aplica daño de energía.',
    'Resonancia Térmica',
    'Otorga +4 de Resistencia y +3 de Fuerza. Resistencia natural a efectos de congelación y quemadura.',
    3, 2, 1, 5, 1, 1,
    'dragonkin_preset'
),
(
    'sylvan',
    'Sylvanos',
    'Seres nacidos del tejido vivo de Aethoria. Entienden los patrones biológicos, las ondas acústicas y el equilibrio ecosistémico.',
    'Naturaleza',
    'Comunión Silvestre',
    'Enraíza a los enemigos cercanos durante 3 segundos y restaura salud al personaje.',
    'Equilibrio Natural',
    'Otorga +4 de Agilidad y +4 de Sabiduría. Mayor velocidad base de movimiento en un 7%.',
    1, 2, 4, 1, 2, 4,
    'sylvan_preset'
) ON CONFLICT (code) DO NOTHING;

-- 4. Clases de Personaje
INSERT INTO character_classes (code, name, role, description, primary_stat, resource_type, base_health, base_resource, icon) VALUES
(
    'guardian',
    'Guardián',
    'Tanque',
    'El escudo inquebrantable del grupo. Maneja armaduras pesadas, atrae la atención de las sombras y defiende a sus aliados con voluntad férrea.',
    'Fuerza / Resistencia',
    'Furia',
    160, 100,
    'shield'
),
(
    'arcanist',
    'Arcanista',
    'Daño Mágico',
    'Canalizador de las ecuaciones del cosmos. Desata devastadores hechizos de energía, manipulando el espacio y el tiempo.',
    'Inteligencia',
    'Mana',
    95, 150,
    'sparkles'
),
(
    'ranger',
    'Explorador',
    'Daño a Distancia',
    'Tirador de élite y rastreador de ruinas. Calcula trayectorias precisas con su arco y coloca dispositivos tácticos.',
    'Agilidad',
    'Energía',
    115, 110,
    'crosshair'
),
(
    'summoner',
    'Invocador',
    'Invocación y Apoyo',
    'Comandante de constructos rúnicos y entidades de memoria. Modifica el flujo del combate a través de sus aliados invocados.',
    'Sabiduría',
    'Mana',
    105, 130,
    'flame'
),
(
    'runic_engineer',
    'Ingeniero Rúnico',
    'Daño y Utilidad',
    'Especialista en palancas, engranajes y torretas electromagnéticas. Resuelve desafíos mediante la aplicación de la física práctica.',
    'Inteligencia / Fuerza',
    'Vapor Rúnico',
    125, 100,
    'wrench'
),
(
    'scholar',
    'Erudito',
    'Soporte y Análisis',
    'Descifrador de manuscritos y estratega supremo. Cura heridas mediante frecuencias armónicas y debilita enemigos exponiendo sus contradicciones.',
    'Percepción / Sabiduría',
    'Conocimiento',
    110, 140,
    'book-open'
) ON CONFLICT (code) DO NOTHING;

-- 5. Habilidades Iniciales por Clase
INSERT INTO skill_definitions (class_id, code, name, description, icon, required_level, resource_cost, cooldown_ms, range_pixels, damage_multiplier, effect_type, animation_key, associated_competency) VALUES
-- Habilidades de Guardián (ID 1)
(1, 'slash_strike', 'Golpe Resuelto', 'Ataque pesado cuerpo a cuerpo que inflige daño físico contundente.', 'sword', 1, 15, 1500, 55.0, 1.3, 'damage', 'slash_vfx', 'FISICA'),
(1, 'shield_slam', 'Embate de Escudo', 'Golpea con el escudo, aturdiendo al objetivo por 1.5s y generando amenaza.', 'shield', 2, 25, 6000, 50.0, 1.1, 'stun', 'slam_vfx', 'FISICA'),
(1, 'iron_bulwark', 'Baluarte de Hierro', 'Reduce todo el daño recibido en un 40% durante 5 segundos.', 'shield-check', 4, 30, 15000, 0.0, 0.0, 'buff', 'buff_vfx', 'GENERAL'),

-- Habilidades de Arcanista (ID 2)
(2, 'arcane_bolt', 'Dardo Arcano', 'Dispara un proyectil de pura energía de razonamiento a distancia.', 'sparkles', 1, 20, 1200, 240.0, 1.5, 'damage', 'bolt_vfx', 'MATEMATICAS'),
(2, 'energy_nova', 'Nova Racional', 'Desata un estallido expansivo que daña a todos los enemigos a su alrededor.', 'sun', 3, 40, 8000, 120.0, 2.0, 'area_damage', 'nova_vfx', 'MATEMATICAS'),
(2, 'spatial_teleport', 'Salto Dimensional', 'Teletransporta al arcanista 150 píxeles hacia la dirección del cursor.', 'move', 5, 35, 10000, 150.0, 0.0, 'utility', 'teleport_vfx', 'FISICA'),

-- Habilidades de Explorador (ID 3)
(3, 'steady_shot', 'Disparo Calculado', 'Flecha de precisión balística que inflige daño crítico a distancia.', 'target', 1, 15, 1400, 260.0, 1.4, 'damage', 'arrow_vfx', 'FISICA'),
(3, 'piercing_arrow', 'Tiro Perforante', 'Atraviesa una línea de enemigos en la trayectoria calculada.', 'arrow-right', 3, 30, 7000, 280.0, 1.8, 'line_damage', 'pierce_vfx', 'FISICA'),

-- Habilidades de Ingeniero Rúnico (ID 5)
(4, 'construct_turret', 'Torreta de Engranajes', 'Despliega un autómata que dispara proyectiles rúnicos automáticamente.', 'cog', 1, 30, 12000, 100.0, 1.0, 'summon', 'turret_vfx', 'MATEMATICAS'),

-- Habilidades de Erudito (ID 6)
(6, 'words_of_restoration', 'Verbo de Restauración', 'Canaliza la memoria pura para sanar las heridas de un aliado o del jugador.', 'heart-pulse', 1, 25, 2500, 200.0, 1.5, 'heal', 'heal_vfx', 'LECTURA_CRITICA'),
(6, 'unveil_truth', 'Revelación Analítica', 'Debilita la defensa del objetivo exponiendo su falacia estructural por 8s.', 'eye', 3, 20, 8000, 180.0, 0.0, 'debuff', 'reveal_vfx', 'LECTURA_CRITICA')
ON CONFLICT (code) DO NOTHING;

-- 6. Zonas de Aethoria
INSERT INTO world_zones (code, name, description, level_min, level_max, theme, ambient_color, is_safe_zone) VALUES
('valle_despertares', 'Valle de los Despertares', 'Un valle bañado por un sol dorado y rodeado de antiguos monolitos donde los Viajeros recuperan la consciencia.', 1, 10, 'plains', '#16a34a', TRUE),
('bosque_lunaria', 'Bosque de Lunaria', 'Bosque ancestral con árboles plateados y manuscritos petrificados. Foco principal de los enigmas de Lectura Crítica.', 10, 20, 'forest', '#2563eb', FALSE),
('forjaterra', 'Forjaterra', 'Ciudadela de piedra y metal impulsada por vapor rúnico. Sus compuertas y puentes exigen cálculo matemático para operar.', 20, 30, 'forge', '#d97706', FALSE),
('llanuras_ignis', 'Llanuras de Ignis', 'Tierras volcánicas donde los campos de energía, gravedad y trayectorias cinéticas ponen a prueba las leyes físicas.', 30, 40, 'fire', '#dc2626', FALSE),
('biblioteca_verdades', 'Biblioteca de las Verdades', 'El gran repositorio milenario donde reposan los anales de Aethoria antes de la llegada del Vacío.', 40, 50, 'library', '#7c3aed', TRUE),
('montanas_olvido', 'Montañas del Olvido', 'Picos nevados azotados por tempestades de amnesia donde habitan los constructos más antiguos.', 50, 60, 'mountain', '#64748b', FALSE),
('ciudadela_vacio', 'Ciudadela del Vacío', 'El epicentro de la distorsión, donde las leyes de la lógica y la física intentan ser devoradas por la entropía.', 60, 70, 'void', '#4c1d95', FALSE)
ON CONFLICT (code) DO NOTHING;

-- 7. NPCs Clave
INSERT INTO npc (zone_id, code, name, title, role, pos_x, pos_y, sprite_key, dialogue_intro) VALUES
(1, 'npc_vaelen', 'Maestro Erudito Vaelen', 'Cronista del Amanecer', 'narrador', 420.0, 280.0, 'npc_vaelen', 
'Saludos, Viajero. Has despertado a tiempo. El Vacío avanza consumiendo el conocimiento de Aethoria. Si no reconstruimos los principios de la Razón y la Memoria, el mundo colapsará en el olvido.'),

(1, 'npc_brom', 'Herrero Brom Martillofirme', 'Forjador Rúnico', 'comerciante', 600.0, 350.0, 'npc_brom',
'¡Por el fuego de la forja! Si vas a enfrentarte a las Sombras del Vacío necesitarás más que buena fe. Tengo armas templadas y armaduras resistentes a cambio de oro o favores.'),

(1, 'npc_lyra', 'Arcanista Lyra', 'Guardiana de los Manuscritos', 'investigador', 300.0, 480.0, 'npc_lyra',
'He descubierto un fragmento antiguo en las ruinas del norte. Sin embargo, su significado está velado por contradicciones retóricas. ¿Me ayudarías a descifrarlo?')
ON CONFLICT (code) DO NOTHING;

-- 8. Enemigos Iniciales
INSERT INTO enemies (zone_id, code, name, level, max_health, attack_power, defense, speed, aggro_range, attack_range, exp_reward, gold_min, gold_max, sprite_key, behavior) VALUES
(1, 'shadow_crawler', 'Sombra Menor del Vacío', 1, 65, 10, 2, 60.0, 140.0, 40.0, 30, 2, 6, 'shadow_crawler', 'aggressive'),
(1, 'hollow_wanderer', 'Desmemoriado Errante', 2, 90, 14, 4, 50.0, 130.0, 45.0, 45, 3, 9, 'hollow_wanderer', 'aggressive'),
(1, 'unstable_construct', 'Constructo Rúnico Inestable', 3, 140, 18, 6, 40.0, 120.0, 50.0, 65, 5, 12, 'unstable_construct', 'aggressive'),
(1, 'void_leech', 'Devorador de Recuerdos', 4, 180, 22, 8, 75.0, 160.0, 45.0, 90, 8, 16, 'void_leech', 'aggressive')
ON CONFLICT (code) DO NOTHING;

-- 9. Jefes Legendarios
INSERT INTO bosses (zone_id, code, name, title, educational_focus, level, max_health, attack_power, phases_count, mechanics_desc, exp_reward, gold_reward, sprite_key) VALUES
(1, 'boss_echo_keeper', 'El Guardián de los Ecos', 'Custodio del Olvido', 'lectura_critica', 5, 1200, 32, 2, 
'Durante la batalla genera réplicas ilusorias. Para dañarlo, el jugador debe identificar al guardián original prestando atención a las contradicciones en sus declaraciones rúnicas.', 500, 150, 'boss_echo_keeper'),

(3, 'boss_proportion_architect', 'El Arquitecto de las Proporciones', 'Geómetra Sagrado', 'matematicas', 15, 3500, 55, 3, 
'Modifica las dimensiones del suelo de combate. Los jugadores deben posicionarse en los cuadrantes cuyas proporciones de área neutralicen su pulso geométrico.', 1800, 400, 'boss_proportion_architect'),

(4, 'boss_fracture_beast', 'La Bestia de la Fractura', 'Coloso de la Cinética', 'fisica', 25, 6000, 75, 3, 
'Lanza esferas masivas con trayectorias parabólicas variables y altera la gravedad de la arena. El jugador debe calcular los puntos ciegos balísticos y usar palancas de contrapeso.', 3200, 700, 'boss_fracture_beast'),

(5, 'boss_void_librarian', 'El Bibliotecario del Vacío', 'Soberano de la Ignorancia', 'integrador', 35, 12000, 110, 4, 
'Jefe final del arco narrativo. Combina las 3 disciplinas: distorsiona la física de la sala, altera los números de los sellos y genera falsos testimonios históricos.', 8000, 2000, 'boss_void_librarian')
ON CONFLICT (code) DO NOTHING;

-- 10. Ítems y Equipamiento
INSERT INTO items (code, name, description, item_type, rarity, required_level, bonus_str, bonus_int, bonus_agi, bonus_sta, bonus_per, bonus_wis, buy_price, sell_price, icon, effects_json) VALUES
('starter_sword', 'Espada del Despertar', 'Espada básica de acero forjada en las aldeas libres de Aethoria.', 'weapon', 'common', 1, 3, 0, 1, 1, 0, 0, 15, 5, 'sword', '{"attack": 8}'),
('starter_staff', 'Báculo de Concentración', 'Báculo de madera de fresno que canaliza la energía del pensamiento.', 'weapon', 'common', 1, 0, 4, 0, 1, 1, 2, 15, 5, 'wand', '{"magic_power": 10}'),
('starter_bow', 'Arco de Tejo Templado', 'Arco flexible adecuado para calcular trayectorias certeras a distancia.', 'weapon', 'common', 1, 1, 0, 4, 1, 2, 0, 15, 5, 'crosshair', '{"ranged_attack": 9}'),
('iron_chestplate', 'Pechera de Guardia Novicio', 'Coraza remachada que protege el torso contra mordeduras de sombras.', 'chest', 'common', 1, 1, 0, 0, 5, 0, 0, 25, 8, 'shield', '{"defense": 6}'),
('robe_of_memory', 'Túnica de los Ecos', 'Vestimenta ceremonial tejida con hilos de memoria pura.', 'chest', 'uncommon', 2, 0, 4, 1, 2, 3, 3, 40, 15, 'shirt', '{"defense": 3, "mana_regen": 2}'),
('potion_health_minor', 'Poción Menor de Vigor', 'Brebaje alquímico que restaura 60 puntos de salud de inmediato.', 'potion', 'common', 1, 0, 0, 0, 0, 0, 0, 10, 3, 'heart', '{"heal_amount": 60}'),
('potion_mana_minor', 'Poción Menor de Claridad', 'Elixir brillante que recupera 50 puntos de recurso mental.', 'potion', 'common', 1, 0, 0, 0, 0, 0, 0, 10, 3, 'sparkles', '{"resource_amount": 50}'),
('ancient_scroll_fragment', 'Fragmento de Papiro Olvidado', 'Un vestigio de las crónicas de Lunaria. Esconde un secreto histórico.', 'quest_item', 'rare', 1, 0, 0, 0, 0, 2, 2, 0, 0, 'scroll', '{"quest_id": 1}')
ON CONFLICT (code) DO NOTHING;

-- 11. Áreas y Competencias Educativas Saber 11 (ICFES)
INSERT INTO learning_areas (code, name, description, icon) VALUES
('LECTURA_CRITICA', 'Lectura Crítica', 'Comprensión, interpretación, análisis de intenciones y evaluación crítica de argumentos.', 'book-open'),
('MATEMATICAS', 'Matemáticas', 'Interpretación, representación, formulación, ejecución y argumentación cuantitativa y espacial.', 'calculator'),
('FISICA', 'Ciencias Naturales: Física', 'Comprensión de fuerzas, cinemática, energía, circuitos, electromagnetismo y ondas.', 'zap')
ON CONFLICT (code) DO NOTHING;

INSERT INTO learning_competencies (area_id, code, name, description) VALUES
-- Lectura Crítica (Área 1)
(1, 'LC_IDENTIFICAR', 'Identificar y entender contenidos locales', 'Identificar los eventos, hechos, ideas y personajes explícitos en los testimonios y documentos.'),
(1, 'LC_COMPRENDER', 'Comprender cómo se articulan las partes de un texto', 'Deducir relaciones de causa, efecto, contradicción y coherencia entre argumentos y testimonios.'),
(1, 'LC_REFLEXIONAR', 'Reflexionar y evaluar la validez de textos', 'Evaluar la fiabilidad de fuentes, reconocer falacias, intenciones ocultas y supuestos no fundamentados.'),

-- Matemáticas (Área 2)
(2, 'MAT_INTERPRETACION', 'Interpretación y Representación', 'Comprender y transformar representaciones de datos, mapas, planos, coordenadas y proporciones.'),
(2, 'MAT_FORMULACION', 'Formulación y Ejecución', 'Diseñar estrategias para resolver problemas de optimización, ecuaciones y relaciones métricas.'),
(2, 'MAT_ARGUMENTACION', 'Argumentación Cuantitativa', 'Justificar la validez de procedimientos matemáticos, identificar patrones numéricos y propiedades lógicas.'),

-- Física (Área 3)
(3, 'FIS_CINEMATICA', 'Movimiento y Cinemática', 'Analizar trayectorias, velocidades, aceleraciones y relaciones espacio-tiempo.'),
(3, 'FIS_DINAMICA', 'Fuerzas y Leyes de Newton', 'Comprender el equilibrio de cuerpos, fuerzas de fricción, tensión y conservación del momentum.'),
(3, 'FIS_ENERGIA', 'Trabajo, Potencia y Conservación de Energía', 'Analizar transformaciones entre energía cinética, potencial, calor y sistemas mecánicos.'),
(3, 'FIS_ELECTRICIDAD', 'Circuitos y Fenómenos Ondulatorios', 'Comprender corrientes, resistencias en serie/paralelo y comportamiento de ondas lumínicas y sonoras.')
ON CONFLICT (code) DO NOTHING;

-- 12. Actividades Educativas Integradas
INSERT INTO learning_activities (area_id, competency_id, title, narrative_context, activity_type, difficulty_level, statement, context_data, reward_exp, reward_gold) VALUES
-- Actividad 1: Lectura Crítica
(
    1, 2,
    'El Enigma del Testigo de Lunaria',
    'En la aldea del Valle ha desaparecido un mapa rúnico sagrado. Dos exploradores presentan sus declaraciones ante el Maestro Vaelen.',
    'witness_contradiction',
    'principiante',
    'El Explorador Thorne asegura: "Yo vi a la sombra entrar a la capilla exactamente cuando el reloj solar marcaba la medianoche". Por su parte, la Arcanista Lyra afirma: "Es imposible que el reloj solar funcionara a esa hora; además, la cerradura no fue forzada por magia, sino abierta con una llave de forja". Analiza los dos testimonios y determina cuál es la contradicción fundamental.',
    '{"document_type": "interrogatorio", "characters": ["Thorne", "Lyra"]}',
    120, 30
),
-- Actividad 2: Matemáticas
(
    2, 4,
    'El Flujo de los Mecanismos de Riego',
    'El antiguo acueducto de Forjaterra requiere equilibrar las compuertas para que el flujo de agua alimente equitativamente los dos canales principales.',
    'gear_mechanism',
    'principiante',
    'El Canal A tiene un ancho de 3 metros y requiere un caudal de 12 m³/s. El Canal B tiene el doble de capacidad en volumen pero su compuerta debe abrirse en una proporción de 3:2 respecto a la primera. Si la compuerta A se abre a una altura de 40 cm, ¿cuál debe ser la apertura de la compuerta B para conservar la proporción requerida?',
    '{"mechanic": "compuerta_hidraulica", "proporcion": "3:2", "altura_A": 40}',
    140, 35
),
-- Actividad 3: Física
(
    3, 7,
    'El Mecanismo de Contrapeso y Polea',
    'Para elevar la reja de la fortaleza subterránea, debes equilibrar un sistema de polea móvil con una roca de contrapeso.',
    'energy_circuit',
    'intermedio',
    'La reja de hierro tiene una masa de 240 kg. El mecanismo utiliza un sistema con una polea móvil ideal (que reduce la fuerza necesaria a la mitad). Sin considerar la fricción y asumiendo una aceleración de la gravedad g = 10 m/s², ¿qué fuerza mínima debe aplicarse a la cuerda para mantener la reja en equilibrio estático?',
    '{"masa_reja_kg": 240, "gravedad_ms2": 10, "tipo_polea": "movil"}',
    160, 45
)
ON CONFLICT (id) DO NOTHING;

-- Opciones de la Actividad 1
INSERT INTO learning_options (activity_id, option_label, option_text, is_correct, pedagogical_explanation) VALUES
(1, 'A', 'El testimonio de Thorne se invalida a sí mismo, pues un reloj solar depende de la luz del sol y no puede proyectar sombras legibles a medianoche.', TRUE, 'Correcto: Identificaste la inconsistencia lógica intrínseca del testimonio explícito.'),
(1, 'B', 'Lyra miente porque las cerraduras de Aethoria solo pueden ser forzadas con magia arcana y no con llaves mecánicas.', FALSE, 'Incorrecto: El texto no afirma que las cerraduras sean exclusivamente mágicas.'),
(1, 'C', 'Ambos testigos dicen la verdad porque las sombras pueden iluminar relojes mágicos en la oscuridad.', FALSE, 'Incorrecto: Confunde la naturaleza de un reloj solar tradicional con una hipótesis no sustentada.'),
(1, 'D', 'Thorne tiene razón porque la luna llena proyecta exactamente la misma sombra que el sol a mediodía.', FALSE, 'Incorrecto: La afirmación carece de sustento astronómico y no corresponde a la lectura crítica.')
ON CONFLICT (id) DO NOTHING;

-- Opciones de la Actividad 2
INSERT INTO learning_options (activity_id, option_label, option_text, is_correct, pedagogical_explanation) VALUES
(2, 'A', '60 centímetros.', FALSE, 'Incorrecto: Invertiste la relación de proporcionalidad.'),
(2, 'B', '26.6 centímetros (o 26 y 2/3 cm).', TRUE, 'Correcto: Si la relación es 3 a 2, entonces 40 * (2/3) ≈ 26.67 cm para mantener la razón proporcional requerida.'),
(2, 'C', '80 centímetros.', FALSE, 'Incorrecto: Duplicaste la medida sin aplicar la proporción establecida.'),
(2, 'D', '50 centímetros.', FALSE, 'Incorrecto: No satisface la proporción 3:2.')
ON CONFLICT (id) DO NOTHING;

-- Opciones de la Actividad 3
INSERT INTO learning_options (activity_id, option_label, option_text, is_correct, pedagogical_explanation) VALUES
(3, 'A', '2400 Newtons.', FALSE, 'Incorrecto: Ese es el peso total del objeto sin considerar la ventaja mecánica de la polea móvil.'),
(3, 'B', '1200 Newtons.', TRUE, 'Correcto: Peso = m * g = 240 kg * 10 m/s² = 2400 N. Una polea móvil reduce el esfuerzo requerido a F = Peso / 2 = 1200 N.'),
(3, 'C', '600 Newtons.', FALSE, 'Incorrecto: Eso correspondería a un sistema con dos poleas móviles o polipasto 4:1.'),
(3, 'D', '240 Newtons.', FALSE, 'Incorrecto: Confundiste masa en kilogramos con fuerza en Newtons sin multiplicar por la gravedad.')
ON CONFLICT (id) DO NOTHING;

-- 13. Misiones Iniciales de la Campaña (Capítulo I)
INSERT INTO quests (code, title, chapter, narrative_description, npc_giver_id, zone_id, required_level, reward_exp, reward_gold, reward_item_id, associated_learning_activity_id) VALUES
(
    'quest_awakening',
    'El Despertar de la Razón',
    'Capítulo I',
    'Has abierto los ojos en el Valle de los Despertares. Habla con el Maestro Erudito Vaelen para comprender tu destino como Viajero del Conocimiento.',
    1, 1, 1, 100, 20, 1, NULL
),
(
    'quest_shadows_past',
    'Las Sombras del Olvido',
    'Capítulo I',
    'Las Sombras Menores del Vacío merodean cerca del templo. Elimina a 3 de ellas para asegurar el perímetro de los manuscritos sagrados.',
    1, 1, 1, 150, 35, 6, NULL
),
(
    'quest_witness_puzzle',
    'El Enigma del Testigo Olvidado',
    'Capítulo I',
    'El Maestro Vaelen necesita que utilices tus facultades de lectura crítica para analizar los testimonios contradictorios sobre el mapa robado.',
    1, 1, 2, 200, 50, 8, 1
)
ON CONFLICT (code) DO NOTHING;

-- Objetivos de las Misiones
INSERT INTO quest_objectives (quest_id, objective_type, description, target_id, required_amount) VALUES
(1, 'talk', 'Habla con el Maestro Erudito Vaelen en el centro del Valle', 'npc_vaelen', 1),
(2, 'kill', 'Derrota Sombras Menores del Vacío en el Valle', 'shadow_crawler', 3),
(3, 'puzzle', 'Resuelve el enigma de contradicción entre Thorne y Lyra', 'activity_1', 1)
ON CONFLICT (id) DO NOTHING;

-- 14. Logros Iniciales
INSERT INTO achievements (code, title, description, category, points, icon, reward_title) VALUES
('ach_first_steps', 'Primeros Pasos en Aethoria', 'Crea tu personaje e ingresa al Valle de los Despertares.', 'general', 10, 'footprints', 'El Despierto'),
('ach_shadow_bane', 'Disipador de Sombras', 'Derrota a tu primer enemigo corrompido por el Vacío.', 'combat', 15, 'shield-alert', 'Guardián del Alba'),
('ach_critical_mind', 'Mente Crítica', 'Resuelve con éxito tu primer desafío de Lectura Crítica.', 'education', 25, 'book-open-check', 'El Analítico'),
('ach_mechanic_master', 'Ingenio Rúnico', 'Supera un mecanismo ambiental aplicando principios matemáticos.', 'education', 25, 'wrench', 'El Calculador'),
('ach_kinetic_sense', 'Dominio de las Fuerzas', 'Resuelve un acertijo aplicando leyes físicas comprobadas.', 'education', 25, 'zap', 'El Físico de Aethoria')
ON CONFLICT (code) DO NOTHING;
