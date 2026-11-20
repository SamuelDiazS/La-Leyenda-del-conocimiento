-- ==============================================================================
-- LA LEYENDA DEL CONOCIMIENTO - MMORPG EDUCATIVO 2D (ICFES SABER 11)
-- SCHEMA DEFINITIVO PARA NEON POSTGRESQL
-- ==============================================================================

-- Extensiones recomendadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. AUTENTICACIÓN Y ROLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    must_change_password BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. SISTEMA DE RAZAS Y CLASES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS races (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    affinity_area VARCHAR(50) NOT NULL, -- Memoria, Mecanismos, Energía, Naturaleza, Adaptabilidad
    active_skill_name VARCHAR(100) NOT NULL,
    active_skill_desc TEXT NOT NULL,
    passive_skill_name VARCHAR(100) NOT NULL,
    passive_skill_desc TEXT NOT NULL,
    bonus_strength INTEGER DEFAULT 0,
    bonus_intelligence INTEGER DEFAULT 0,
    bonus_agility INTEGER DEFAULT 0,
    bonus_stamina INTEGER DEFAULT 0,
    bonus_perception INTEGER DEFAULT 0,
    bonus_wisdom INTEGER DEFAULT 0,
    sprite_preset VARCHAR(50) DEFAULT 'human_default'
);

CREATE TABLE IF NOT EXISTS character_classes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Tanque, Daño Mágico, Daño a Distancia, Invocación, Utilidad, Soporte
    description TEXT NOT NULL,
    primary_stat VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) DEFAULT 'Mana', -- Mana, Energía, Furia, Flujo
    base_health INTEGER DEFAULT 120,
    base_resource INTEGER DEFAULT 100,
    icon VARCHAR(100) DEFAULT 'shield'
);

-- ==============================================================================
-- 3. PERSONAJES Y PERSONALIZACIÓN
-- ==============================================================================

CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) UNIQUE NOT NULL,
    race_id INTEGER REFERENCES races(id),
    class_id INTEGER REFERENCES character_classes(id),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    experience_to_next INTEGER DEFAULT 200,
    health INTEGER DEFAULT 120,
    max_health INTEGER DEFAULT 120,
    resource INTEGER DEFAULT 100,
    max_resource INTEGER DEFAULT 100,
    attribute_points INTEGER DEFAULT 0,
    skill_points INTEGER DEFAULT 1,
    gold INTEGER DEFAULT 50,
    current_zone VARCHAR(100) DEFAULT 'valle_despertares',
    pos_x REAL DEFAULT 400.0,
    pos_y REAL DEFAULT 300.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS character_appearance (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    gender VARCHAR(20) DEFAULT 'unisex',
    skin_tone VARCHAR(30) DEFAULT '#f8d5b8',
    hair_style VARCHAR(30) DEFAULT 'short_warrior',
    hair_color VARCHAR(30) DEFAULT '#4a2c11',
    eye_color VARCHAR(30) DEFAULT '#2563eb',
    outfit_color VARCHAR(30) DEFAULT '#3b82f6',
    cape_color VARCHAR(30) DEFAULT '#991b1b',
    has_aura BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS character_attributes (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    strength INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    stamina INTEGER DEFAULT 10,
    perception INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10
);

-- ==============================================================================
-- 4. HABILIDADES Y ÁRBOL DE TALENTOS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS skill_definitions (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES character_classes(id),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    required_level INTEGER DEFAULT 1,
    resource_cost INTEGER DEFAULT 15,
    cooldown_ms INTEGER DEFAULT 2000,
    cast_time_ms INTEGER DEFAULT 0,
    range_pixels REAL DEFAULT 60.0,
    damage_multiplier REAL DEFAULT 1.0,
    effect_type VARCHAR(50) DEFAULT 'damage', -- damage, heal, buff, debuff, shield, utility
    animation_key VARCHAR(50) DEFAULT 'slash_vfx',
    associated_competency VARCHAR(50) DEFAULT 'GENERAL'
);

CREATE TABLE IF NOT EXISTS character_skills (
    id SERIAL PRIMARY KEY,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skill_definitions(id) ON DELETE CASCADE,
    rank INTEGER DEFAULT 1,
    is_slotted BOOLEAN DEFAULT FALSE,
    hotbar_slot INTEGER CHECK (hotbar_slot BETWEEN 1 AND 6),
    UNIQUE (character_id, skill_id)
);

-- ==============================================================================
-- 5. MUNDO: ZONAS, NPC Y DIÁLOGOS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS world_zones (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    level_min INTEGER DEFAULT 1,
    level_max INTEGER DEFAULT 10,
    theme VARCHAR(50) DEFAULT 'plains',
    ambient_color VARCHAR(30) DEFAULT '#22c55e',
    is_safe_zone BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS world_locations (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES world_zones(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    pos_x REAL NOT NULL,
    pos_y REAL NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS npc (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES world_zones(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- narrador, comerciante, investigador, maestro_habilidades, guardian
    pos_x REAL NOT NULL,
    pos_y REAL NOT NULL,
    sprite_key VARCHAR(50) DEFAULT 'npc_elder',
    dialogue_intro TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS npc_dialogues (
    id SERIAL PRIMARY KEY,
    npc_id INTEGER REFERENCES npc(id) ON DELETE CASCADE,
    dialogue_key VARCHAR(50) NOT NULL,
    prompt_text TEXT NOT NULL,
    options_json JSONB DEFAULT '[]'::jsonb
);

-- ==============================================================================
-- 6. ENEMIGOS Y JEFES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS enemies (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES world_zones(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    max_health INTEGER DEFAULT 80,
    attack_power INTEGER DEFAULT 12,
    defense INTEGER DEFAULT 4,
    speed REAL DEFAULT 70.0,
    aggro_range REAL DEFAULT 150.0,
    attack_range REAL DEFAULT 45.0,
    exp_reward INTEGER DEFAULT 35,
    gold_min INTEGER DEFAULT 2,
    gold_max INTEGER DEFAULT 8,
    sprite_key VARCHAR(50) DEFAULT 'shadow_crawler',
    behavior VARCHAR(50) DEFAULT 'aggressive'
);

CREATE TABLE IF NOT EXISTS bosses (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES world_zones(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    educational_focus VARCHAR(50) NOT NULL, -- lectura_critica, matematicas, fisica, integrador
    level INTEGER DEFAULT 10,
    max_health INTEGER DEFAULT 2500,
    attack_power INTEGER DEFAULT 45,
    phases_count INTEGER DEFAULT 3,
    mechanics_desc TEXT NOT NULL,
    exp_reward INTEGER DEFAULT 1500,
    gold_reward INTEGER DEFAULT 300,
    sprite_key VARCHAR(50) DEFAULT 'boss_echo_keeper'
);

-- ==============================================================================
-- 7. ÍTEMS, EQUIPAMIENTO E INVENTARIO
-- ==============================================================================

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- weapon, helm, chest, legs, boots, accessory, potion, quest_item, artifact
    rarity VARCHAR(30) DEFAULT 'common', -- common, uncommon, rare, epic, legendary, mythic
    required_level INTEGER DEFAULT 1,
    bonus_str INTEGER DEFAULT 0,
    bonus_int INTEGER DEFAULT 0,
    bonus_agi INTEGER DEFAULT 0,
    bonus_sta INTEGER DEFAULT 0,
    bonus_per INTEGER DEFAULT 0,
    bonus_wis INTEGER DEFAULT 0,
    buy_price INTEGER DEFAULT 10,
    sell_price INTEGER DEFAULT 4,
    icon VARCHAR(100) DEFAULT 'sword',
    effects_json JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS character_inventory (
    id SERIAL PRIMARY KEY,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    slot_index INTEGER NOT NULL CHECK (slot_index BETWEEN 0 AND 39),
    quantity INTEGER DEFAULT 1,
    UNIQUE (character_id, slot_index)
);

CREATE TABLE IF NOT EXISTS character_equipment (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    slot_name VARCHAR(30) NOT NULL, -- head, chest, legs, boots, main_hand, off_hand, accessory
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, slot_name)
);

CREATE TABLE IF NOT EXISTS enemy_drops (
    id SERIAL PRIMARY KEY,
    enemy_id INTEGER REFERENCES enemies(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    drop_chance_percent REAL DEFAULT 25.0,
    min_qty INTEGER DEFAULT 1,
    max_qty INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    npc_id INTEGER REFERENCES npc(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS shop_inventory (
    shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT -1, -- -1 = infinito
    PRIMARY KEY (shop_id, item_id)
);

-- ==============================================================================
-- 8. SISTEMA DE APRENDIZAJE SABER 11 (ICFES)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS learning_areas (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_competencies (
    id SERIAL PRIMARY KEY,
    area_id INTEGER REFERENCES learning_areas(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_activities (
    id SERIAL PRIMARY KEY,
    area_id INTEGER REFERENCES learning_areas(id) ON DELETE CASCADE,
    competency_id INTEGER REFERENCES learning_competencies(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    narrative_context TEXT NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- ruin_investigation, gear_mechanism, energy_circuit, witness_contradiction
    difficulty_level VARCHAR(30) DEFAULT 'principiante', -- principiante, intermedio, avanzado, experto
    statement TEXT NOT NULL,
    context_data JSONB DEFAULT '{}'::jsonb, -- Manuscrito, fórmula, valores numéricos, pistas
    reward_exp INTEGER DEFAULT 100,
    reward_gold INTEGER DEFAULT 25
);

CREATE TABLE IF NOT EXISTS learning_options (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES learning_activities(id) ON DELETE CASCADE,
    option_label VARCHAR(10) NOT NULL, -- A, B, C, D
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    pedagogical_explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_attempts (
    id SERIAL PRIMARY KEY,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES learning_activities(id) ON DELETE CASCADE,
    selected_option_id INTEGER REFERENCES learning_options(id),
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competency_progress (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    competency_id INTEGER REFERENCES learning_competencies(id) ON DELETE CASCADE,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    mastery_percentage REAL DEFAULT 0.0,
    last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (character_id, competency_id)
);

-- ==============================================================================
-- 9. MISIONES (QUESTS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    chapter VARCHAR(50) DEFAULT 'Capitulo I',
    narrative_description TEXT NOT NULL,
    npc_giver_id INTEGER REFERENCES npc(id),
    zone_id INTEGER REFERENCES world_zones(id),
    required_level INTEGER DEFAULT 1,
    reward_exp INTEGER DEFAULT 150,
    reward_gold INTEGER DEFAULT 40,
    reward_item_id INTEGER REFERENCES items(id),
    associated_learning_activity_id INTEGER REFERENCES learning_activities(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quest_objectives (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    objective_type VARCHAR(50) NOT NULL, -- kill, collect, puzzle, talk, inspect
    description VARCHAR(200) NOT NULL,
    target_id VARCHAR(50),
    required_amount INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS character_quests (
    id SERIAL PRIMARY KEY,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'in_progress', -- in_progress, completed, failed
    current_progress JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (character_id, quest_id)
);

-- ==============================================================================
-- 10. MULTIJUGADOR, LOGROS Y AUDITORÍA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    points INTEGER DEFAULT 10,
    icon VARCHAR(100) DEFAULT 'trophy'
);

CREATE TABLE IF NOT EXISTS character_achievements (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (character_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    sender_character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
    sender_name VARCHAR(50) NOT NULL,
    channel VARCHAR(30) DEFAULT 'global', -- global, zone, party, system
    zone_id VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    admin_username VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- ÍNDICES DE ALTO RENDIMIENTO
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_character_inventory_char_id ON character_inventory(character_id);
CREATE INDEX IF NOT EXISTS idx_learning_attempts_char_id ON learning_attempts(character_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_area ON learning_activities(area_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_comp ON learning_activities(competency_id);
CREATE INDEX IF NOT EXISTS idx_character_quests_char_id ON character_quests(character_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action, created_at DESC);
