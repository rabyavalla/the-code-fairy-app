import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput,
  ScrollView, Animated, Dimensions, Alert, RefreshControl, Platform, Image, ImageBackground,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Defs, RadialGradient, Stop, G, Path, Rect, Ellipse } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { BodoniModa_400Regular, BodoniModa_500Medium, BodoniModa_600SemiBold, BodoniModa_700Bold, BodoniModa_400Regular_Italic } from '@expo-google-fonts/bodoni-moda';

// ═══════════════════════════════════════════════
// CUSTOM SVG ICONS — replaces all purple unicode
// ═══════════════════════════════════════════════

// Reusable mini SVG icon wrapper
function SvgIcon({ children, size = 20, color = '#D4A574', style }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>{children}</Svg>;
}

// ── TAB BAR ICONS ──
function IconToday({ size = 22, color = '#D4A574' }) {
  return (
    <SvgIcon size={size}>
      <Circle cx="12" cy="12" r="4" fill={color} opacity="0.9" />
      {[0,45,90,135,180,225,270,315].map(a => {
        const r = (a * Math.PI) / 180;
        return <Line key={a} x1={12+Math.cos(r)*6.5} y1={12+Math.sin(r)*6.5} x2={12+Math.cos(r)*9} y2={12+Math.sin(r)*9} stroke={color} strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </SvgIcon>
  );
}

function IconChart({ size = 22, color = '#D4A574' }) {
  return (
    <SvgIcon size={size}>
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.2" />
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <Line x1="12" y1="1" x2="12" y2="5" stroke={color} strokeWidth="0.8" />
      <Line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="0.8" />
      <Line x1="1" y1="12" x2="5" y2="12" stroke={color} strokeWidth="0.8" />
      <Line x1="19" y1="12" x2="23" y2="12" stroke={color} strokeWidth="0.8" />
      <Circle cx="12" cy="5.5" r="1.5" fill={color} />
      <Circle cx="8" cy="15" r="1.5" fill={color} opacity="0.7" />
      <Circle cx="17" cy="10" r="1.2" fill={color} opacity="0.6" />
    </SvgIcon>
  );
}

function IconLearn({ size = 22, color = '#D4A574' }) {
  return (
    <SvgIcon size={size}>
      <Path d="M2 6L12 2L22 6L12 10L2 6Z" stroke={color} strokeWidth="1.2" fill="none" />
      <Path d="M6 8V16L12 19L18 16V8" stroke={color} strokeWidth="1.2" fill="none" />
      <Line x1="22" y1="6" x2="22" y2="16" stroke={color} strokeWidth="1.2" />
      <Circle cx="22" cy="16.5" r="1" fill={color} />
    </SvgIcon>
  );
}

function IconProfile({ size = 22, color = '#D4A574' }) {
  return (
    <SvgIcon size={size}>
      <Path d="M12 2C9.5 2 8 4.5 8 6.5C8 8 8.5 9 9 9.8C7.5 10.5 5 12 5 16C5 20 7.5 22 12 22C16.5 22 19 20 19 16C19 12 16.5 10.5 15 9.8C15.5 9 16 8 16 6.5C16 4.5 14.5 2 12 2Z" stroke={color} strokeWidth="1.2" fill="none" />
      <Circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1" fill={color} opacity="0.15" />
      <Path d="M7 17C7 14 9 12.5 12 12.5C15 12.5 17 14 17 17" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    </SvgIcon>
  );
}

// ── PLANET ICONS (SVG, not emoji) ──
function IconSun({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.5" fill="none" /><Circle cx="12" cy="12" r="1" fill={color} /></SvgIcon>;
}
function IconMoon({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Path d="M18 12.5C18 17.19 14.19 21 9.5 21C7.06 21 4.87 19.94 3.35 18.27C5.12 19.37 7.23 20 9.5 20C14.19 20 18 16.19 18 11.5C18 9.23 17.37 7.12 16.27 5.35C17.94 6.87 19 9.06 19 11.5" stroke={color} strokeWidth="1.3" fill="none" /><Path d="M15 4C13.5 5.5 12.5 8 12.5 11C12.5 14 13.5 16.5 15 18" stroke={color} strokeWidth="0.8" opacity="0.3" /></SvgIcon>;
}
function IconMercury({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="12" y1="16" x2="12" y2="22" stroke={color} strokeWidth="1.3" /><Line x1="9.5" y1="20" x2="14.5" y2="20" stroke={color} strokeWidth="1.3" /><Path d="M8.5 5C10 3 14 3 15.5 5" stroke={color} strokeWidth="1.3" fill="none" /></SvgIcon>;
}
function IconVenus({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="9" r="5" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="12" y1="14" x2="12" y2="22" stroke={color} strokeWidth="1.3" /><Line x1="9" y1="18.5" x2="15" y2="18.5" stroke={color} strokeWidth="1.3" /></SvgIcon>;
}
function IconMars({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="10" cy="14" r="5.5" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="15" y1="9" x2="20" y2="4" stroke={color} strokeWidth="1.3" /><Path d="M16 4L20 4L20 8" stroke={color} strokeWidth="1.3" fill="none" /></SvgIcon>;
}
function IconJupiter({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Path d="M6 5L14 5C17 5 18 7 17 9C16 11 13 12 10 12L18 12" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="14" y1="5" x2="14" y2="20" stroke={color} strokeWidth="1.3" /></SvgIcon>;
}
function IconSaturn({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Line x1="8" y1="3" x2="14" y2="3" stroke={color} strokeWidth="1.2" /><Line x1="11" y1="3" x2="11" y2="9" stroke={color} strokeWidth="1.2" /><Circle cx="12" cy="13" r="5" stroke={color} strokeWidth="1.3" fill="none" /><Path d="M7 18C5 20 4 22 6 22C8 22 8 20 10 19" stroke={color} strokeWidth="1.2" fill="none" /></SvgIcon>;
}
function IconUranus({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="17" r="4" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="12" y1="3" x2="12" y2="13" stroke={color} strokeWidth="1.3" /><Line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.2" /><Circle cx="12" cy="3" r="1.5" stroke={color} strokeWidth="1" fill="none" /></SvgIcon>;
}
function IconNeptune({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="1.3" /><Path d="M6 3C6 8 12 10 12 3" stroke={color} strokeWidth="1.3" fill="none" /><Path d="M12 3C12 10 18 8 18 3" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="8" y1="18" x2="16" y2="18" stroke={color} strokeWidth="1.2" /></SvgIcon>;
}
function IconPluto({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="8" r="5" stroke={color} strokeWidth="1.3" fill="none" /><Line x1="12" y1="13" x2="12" y2="22" stroke={color} strokeWidth="1.3" /><Line x1="8" y1="17" x2="16" y2="17" stroke={color} strokeWidth="1.3" /><Path d="M7 5C9 3 15 3 17 5" stroke={color} strokeWidth="1" opacity="0.4" /></SvgIcon>;
}
function IconNorthNode({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="15" r="5" stroke={color} strokeWidth="1.3" fill="none" /><Path d="M7 10L12 3L17 10" stroke={color} strokeWidth="1.3" fill="none" /></SvgIcon>;
}
function IconChiron({ size = 18, color = '#D4A574' }) {
  return <SvgIcon size={size}><Line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="1.3" /><Circle cx="12" cy="16" r="4" stroke={color} strokeWidth="1.2" fill="none" /><Path d="M12 8L18 4" stroke={color} strokeWidth="1.3" /><Path d="M15 7.5L18 4" stroke={color} strokeWidth="1" /></SvgIcon>;
}

// Map planet keys to icon components
const PLANET_ICON_MAP = {
  sun: IconSun, moon: IconMoon, mercury: IconMercury, venus: IconVenus,
  mars: IconMars, jupiter: IconJupiter, saturn: IconSaturn, uranus: IconUranus,
  neptune: IconNeptune, pluto: IconPluto, north_node: IconNorthNode, chiron: IconChiron,
};

function PlanetIcon({ planet, size = 18, color = '#D4A574' }) {
  const Comp = PLANET_ICON_MAP[planet];
  return Comp ? <Comp size={size} color={color} /> : <IconSun size={size} color={color} />;
}

// ── ZODIAC SIGN ICONS (elegant SVG) ──
function ZodiacIcon({ sign, size = 18, color = '#D4A574' }) {
  const paths = {
    Aries: 'M7 20V8C7 5 9.5 3 12 3C14.5 3 17 5 17 8V20',
    Taurus: 'M6 6C8 4 10 3 12 3C14 3 16 4 18 6M8 10C8 14 10 18 12 20C14 18 16 14 16 10C16 7.5 14.5 6 12 6C9.5 6 8 7.5 8 10Z',
    Gemini: 'M5 3L19 3M5 21L19 21M9 3V21M15 3V21',
    Cancer: 'M5 12C5 8 8 5 12 5C15 5 17 7 17 9C17 11 15.5 12 14 12C12.5 12 11 11 11 9.5M19 12C19 16 16 19 12 19C9 19 7 17 7 15C7 13 8.5 12 10 12C11.5 12 13 13 13 14.5',
    Leo: 'M6 10C6 7 8 5 10.5 5C13 5 14 7 14 9C14 11 12 13 12 16C12 18 13.5 20 16 20C18 20 19 18.5 19 17M6 10C6 13 4 14 4 14',
    Virgo: 'M4 5V16M4 5C4 5 4 10 8 10M8 5V16M8 5C8 5 8 10 12 10M12 5V16M12 16C12 16 12 18 14 18C16 18 18 16 18 14C18 12 16 12 16 12M16 14V20',
    Libra: 'M4 18H20M12 18V10M7 10C7 7 9 5 12 5C15 5 17 7 17 10M4 14H20',
    Scorpio: 'M3 5V16M3 5C3 5 3 10 7 10M7 5V16M7 5C7 5 7 10 11 10M11 5V16H15M15 16L18 13M15 16L18 19',
    Sagittarius: 'M4 20L18 4M18 4L12 4M18 4L18 10M8 12L12 16',
    Capricorn: 'M3 6V14C3 17 5 19 7 19C9 19 10 17 10 15V5C10 5 10 10 14 10C18 10 20 13 20 16C20 19 18 21 16 21C14 21 13 19 13 17',
    Aquarius: 'M3 9L6 6L9 9L12 6L15 9L18 6L21 9M3 15L6 12L9 15L12 12L15 15L18 12L21 15',
    Pisces: 'M7 3C7 3 4 7 4 12C4 17 7 21 7 21M17 3C17 3 20 7 20 12C20 17 17 21 17 21M3 12H21',
  };
  return (
    <SvgIcon size={size}>
      <Path d={paths[sign] || paths.Aries} stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  );
}

// ── DECORATIVE ICONS ──
function IconStarDiamond({ size = 12, color = '#D4A574' }) {
  return <SvgIcon size={size}><Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" fill={color} opacity="0.8" /></SvgIcon>;
}

function IconCelestialDot({ size = 8, color = '#D4A574' }) {
  return <SvgIcon size={size}><Circle cx="12" cy="12" r="3" fill={color} /><Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" /></SvgIcon>;
}

// ═══════════════════════════════════════════════
// FADE-IN IMAGE — smoother perceived loading
// ═══════════════════════════════════════════════
function FadeImage({ style, ...props }) {
  const opacity = useRef(new Animated.Value(0)).current;
  return <Animated.Image {...props} style={[style, { opacity }]} onLoad={() => Animated.timing(opacity, { toValue: style?.opacity ?? 1, duration: 300, useNativeDriver: true }).start()} />;
}

// ═══════════════════════════════════════════════
// GENERATED CELESTIAL ART
// ═══════════════════════════════════════════════
const IMG = {
  welcomeHero: require('./assets/images/welcome_hero.png'),
  zodiacWheel: require('./assets/images/zodiac_wheel.png'),
  celestialBanner: require('./assets/images/celestial_banner.png'),
  moonPhases: require('./assets/images/moon_phases.png'),
  onboardingGateway: require('./assets/images/onboarding_gateway.png'),
  chartHero: require('./assets/images/chart_hero.png'),
  learnHero: require('./assets/images/learn_hero.png'),
  profileHero: require('./assets/images/profile_hero.png'),
  transitCard: require('./assets/images/transit_card.png'),
};

// Zodiac constellation images — personalized per sign
const SIGN_IMAGES = {
  Aries: require('./assets/images/constellation_aries.png'),
  Taurus: require('./assets/images/constellation_taurus.png'),
  Gemini: require('./assets/images/constellation_gemini.png'),
  Cancer: require('./assets/images/constellation_cancer.png'),
  Leo: require('./assets/images/constellation_leo.png'),
  Virgo: require('./assets/images/constellation_virgo.png'),
  Libra: require('./assets/images/constellation_libra.png'),
  Scorpio: require('./assets/images/constellation_scorpio.png'),
  Sagittarius: require('./assets/images/constellation_sagittarius.png'),
  Capricorn: require('./assets/images/constellation_capricorn.png'),
  Aquarius: require('./assets/images/constellation_aquarius.png'),
  Pisces: require('./assets/images/constellation_pisces.png'),
};

// ═══════════════════════════════════════════════
// API CONFIG
// ═══════════════════════════════════════════════
const API_URL = 'https://the-code-fairy-api-production.up.railway.app';

async function fetchChart(birthData) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/chart`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birthData),
    });
    if (!res.ok) throw new Error('Chart calc failed');
    return await res.json();
  } catch (e) { console.log('API error:', e.message); return null; }
}

async function fetchTransits() {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/transits`);
    if (!res.ok) throw new Error('Transit fetch failed');
    return await res.json();
  } catch (e) { console.log('API error:', e.message); return null; }
}

// ═══════════════════════════════════════════════
// DATA HELPERS & CONTENT
// ═══════════════════════════════════════════════
const PLANET_SYMBOLS = { sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇', north_node: '☊', chiron: '⚷' };
const PLANET_NAMES = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto', north_node: 'North Node', chiron: 'Chiron' };
const ZODIAC_GLYPHS = { Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓' };

const PLANET_MEANINGS = {
  sun: { short: 'Your core identity, ego, and life force.', keywords: ['Identity', 'Vitality', 'Purpose', 'Self-Expression'] },
  moon: { short: 'Your emotional world, inner needs, and instincts.', keywords: ['Emotions', 'Intuition', 'Comfort', 'Nurturing'] },
  mercury: { short: 'How you think, communicate, and process.', keywords: ['Communication', 'Intellect', 'Learning', 'Expression'] },
  venus: { short: 'What you love, how you attract, and your style.', keywords: ['Love', 'Beauty', 'Values', 'Pleasure'] },
  mars: { short: 'Your drive, ambition, and raw energy.', keywords: ['Action', 'Desire', 'Courage', 'Passion'] },
  jupiter: { short: 'Where you grow, expand, and find wisdom.', keywords: ['Growth', 'Luck', 'Wisdom', 'Abundance'] },
  saturn: { short: 'Your discipline, structure, and life lessons.', keywords: ['Discipline', 'Responsibility', 'Mastery', 'Boundaries'] },
  uranus: { short: 'Where you innovate and break free.', keywords: ['Freedom', 'Innovation', 'Rebellion', 'Awakening'] },
  neptune: { short: 'Your dreams, illusions, and spirituality.', keywords: ['Dreams', 'Intuition', 'Creativity', 'Transcendence'] },
  pluto: { short: 'Deep transformation and hidden power.', keywords: ['Transformation', 'Power', 'Rebirth', 'Shadow'] },
  north_node: { short: 'Your soul\'s direction and growth path.', keywords: ['Destiny', 'Growth', 'Purpose', 'Evolution'] },
  chiron: { short: 'Your deepest wound and greatest healing gift.', keywords: ['Healing', 'Wisdom', 'Vulnerability', 'Teaching'] },
};

// Sign-specific planet placement interpretations
const PLANET_IN_SIGN = {
  sun: { Aries: 'Your identity burns with pioneering fire. You lead by instinct, act before thinking, and need to carve your own path. Sitting still isn\'t in your code.', Taurus: 'Your identity is rooted in the sensory world. You move slowly and deliberately, building things that last. Comfort, beauty, and loyalty define your core.', Gemini: 'Your identity is wired for curiosity. You\'re the eternal student, shape-shifter, and conversationalist. Your mind moves faster than most can follow.', Cancer: 'Your identity runs on emotional intelligence. You lead through nurturing, protect fiercely, and your mood shapes the room. Home is your power center.', Leo: 'Your identity radiates warmth and demands to be seen. You were born for the spotlight — creative, generous, dramatic, and deeply loyal to your people.', Virgo: 'Your identity is built on precision and service. You notice what others miss, improve what others accept, and find purpose in being genuinely useful.', Libra: 'Your identity seeks harmony and beauty in all things. You\'re the diplomat, the aesthete, the one who sees every side. Relationships shape who you become.', Scorpio: 'Your identity runs deep. You don\'t do surface-level anything. Intense, magnetic, and unafraid of the dark — you transform everything you touch.', Sagittarius: 'Your identity is fueled by freedom and meaning. You\'re the philosopher, the adventurer, the one who needs a bigger horizon. Truth is your north star.', Capricorn: 'Your identity is forged through ambition and discipline. You play the long game, respect structure, and quietly build empires while others talk.', Aquarius: 'Your identity breaks molds. You think in systems, question everything, and carry a vision for the future that others haven\'t imagined yet.', Pisces: 'Your identity dissolves boundaries. You feel everything, absorb the room, and carry a spiritual depth that connects you to something beyond the visible.' },
  moon: { Aries: 'You process emotions through action — when you feel something, you need to move, fight, or create. Sitting with feelings makes you restless.', Taurus: 'Emotional security comes through the physical world — comfort food, soft textures, financial stability. You need life to feel grounded and beautiful.', Gemini: 'You process feelings through talking, writing, and intellectualizing. Your emotional state shifts quickly. You need mental stimulation to feel safe.', Cancer: 'You feel everything at maximum depth. Your emotional instincts are razor-sharp, your nurturing is legendary, and your home is your sanctuary.', Leo: 'You need to feel admired and appreciated to feel emotionally secure. Your feelings are big, dramatic, and generous. Being ignored is your deepest wound.', Virgo: 'You process emotions through analysis and fixing things. Anxiety lives here — but so does an incredible capacity to care through practical acts of love.', Libra: 'Emotional balance is everything. Conflict physically unsettles you. You process feelings through relationships and need harmony to feel at peace.', Scorpio: 'Your emotional world is an ocean — vast, deep, and intense. You feel things most people can\'t access. Trust is hard-won but total once given.', Sagittarius: 'Emotional freedom is non-negotiable. You process feelings through adventure, humor, and philosophical framing. You can\'t be caged emotionally.', Capricorn: 'You were taught early to be self-sufficient emotionally. Feelings get structured and managed. Beneath the composure is a deeply devoted heart.', Aquarius: 'You experience emotions from a slight distance — observing, analyzing, intellectualizing. You care deeply about humanity but may struggle with intimacy.', Pisces: 'Your emotional body has no walls. You absorb everything — other people\'s pain, the energy of a room, the collective mood. Boundaries are your lifelong lesson.' },
  mercury: { Aries: 'Your mind is fast, direct, and competitive. You think in bold strokes, speak before editing, and win arguments through sheer speed.', Taurus: 'Your mind is methodical and grounded. You think slowly but thoroughly, and once you\'ve made up your mind, almost nothing can change it.', Gemini: 'Your mind is a high-speed processor. You juggle multiple ideas simultaneously, communicate effortlessly, and get bored the moment things slow down.', Cancer: 'Your thinking is shaped by feelings and memories. You communicate with emotional intelligence and remember how things made you feel.', Leo: 'Your communication style is warm, dramatic, and confident. You think in stories, speak with authority, and have a natural gift for inspiring others.', Virgo: 'Your mind is a precision instrument. You analyze, organize, and critique with surgical accuracy. Details that others miss are obvious to you.', Libra: 'Your mind seeks balance and fairness in every argument. You see all sides, communicate diplomatically, and struggle with decisions because every option has merit.', Scorpio: 'Your mind goes straight to the hidden truth. You think in layers, communicate strategically, and can detect lies and subtext like a human polygraph.', Sagittarius: 'Your mind paints in big pictures and philosophical frameworks. You communicate with enthusiasm and humor but may skip over important details.', Capricorn: 'Your thinking is strategic, practical, and goal-oriented. You communicate with authority and don\'t waste words. Every thought serves a purpose.', Aquarius: 'Your mind operates on a different frequency. You think in systems, question conventions, and communicate ideas that are years ahead of their time.', Pisces: 'Your mind works through intuition, imagery, and feeling. You think in metaphors, absorb information osmotically, and communicate best through art.' },
  venus: { Aries: 'You love with intensity and impatience. You chase what you want, fall fast, and need passion to stay interested. Boring love is a dealbreaker.', Taurus: 'Love feels like luxury, security, and devotion. You love slowly, deeply, and sensually. Once committed, you are unmovable.', Gemini: 'You need mental connection to feel romantic attraction. Witty banter is foreplay. You love variety, lightness, and a partner who keeps you curious.', Cancer: 'You love through nurturing, creating a home, and emotional merging. You give everything — and need to feel truly safe before you open up.', Leo: 'Love is a grand performance. You need to be adored, and you adore right back. Your love is generous, warm, loyal, and unapologetically dramatic.', Virgo: 'You show love through acts of service, attention to detail, and quiet devotion. You\'re critical because you care — your love is precise and genuine.', Libra: 'Partnership is your art form. You seek beauty, balance, and elegance in love. You need a relationship to feel complete — and you make it look effortless.', Scorpio: 'You love with devastating intensity. All or nothing. Your desire is deep, possessive, and transformative. Surface-level connections bore you.', Sagittarius: 'Love means freedom, adventure, and philosophical connection. You need a partner who expands your world, not one who shrinks it.', Capricorn: 'Love is a serious investment. You commit slowly, love pragmatically, and build partnerships that stand the test of time. Your devotion runs silent and deep.', Aquarius: 'You love unconventionally. Friendship is the foundation of romance. You need intellectual equality and space — traditional love scripts don\'t apply.', Pisces: 'Love is a spiritual experience. You merge completely, love selflessly, and see the divine in your partner. Boundaries in love are your growth edge.' },
  mars: { Aries: 'Your drive is explosive, fast, and fearless. You go after what you want with zero hesitation. You\'re built for starting things and leading the charge.', Taurus: 'Your drive is slow, steady, and unstoppable. You don\'t rush — but once you commit to a goal, you have the endurance to outlast everyone.', Gemini: 'Your energy scatters across multiple interests. You fight with words, pursue through intellect, and get bored with one-track approaches.', Cancer: 'You fight for your people, your home, and your emotional security. Your drive is protective, intuitive, and fueled by deep feeling.', Leo: 'Your drive runs on pride, creativity, and the need to be recognized. You pursue goals with theatrical confidence and refuse to be ignored.', Virgo: 'Your energy is precise, focused, and productive. You channel drive into perfecting systems, solving problems, and getting things right.', Libra: 'Your drive seeks harmony — you fight for fairness, pursue beauty, and take action through collaboration. Direct confrontation is uncomfortable.', Scorpio: 'Your drive is intense, strategic, and relentless. When you want something, you pursue it with laser focus. You don\'t do half-measures.', Sagittarius: 'Your energy is expansive, restless, and freedom-seeking. You pursue goals with philosophical passion and can\'t be contained by small ambitions.', Capricorn: 'Your drive is ambitious, disciplined, and calculated. You pursue long-term goals with the patience and strategy of a chess grandmaster.', Aquarius: 'Your energy is directed toward innovation and collective causes. You fight for ideas, systems, and the future — not personal glory.', Pisces: 'Your drive is fluid and intuitive. You pursue goals through creativity, empathy, and spiritual motivation. Force isn\'t your style — flow is.' },
  jupiter: { Aries: 'Growth comes through bold, independent action. You expand by being first, taking risks, and trusting your instincts over permission.', Taurus: 'Abundance flows through patience, sensory pleasure, and building tangible things. Your growth path is steady and materially rewarding.', Gemini: 'You grow through learning, networking, and pursuing diverse interests. Curiosity is your greatest asset — the more you explore, the luckier you get.', Cancer: 'Growth comes through emotional connections, family, and creating nurturing environments. Your abundance is tied to how safe you make others feel.', Leo: 'You expand through creative expression, generosity, and stepping into the spotlight. The bigger you play, the more the universe rewards you.', Virgo: 'Growth comes through service, health, and perfecting your craft. Your abundance is quiet but real — mastery of detail creates opportunity.', Libra: 'You grow through partnerships, beauty, and diplomatic skill. Your expansion comes through others — the right relationships unlock everything.', Scorpio: 'Growth comes through transformation, deep research, and shared resources. You expand by going deeper, not wider. Power is your growth currency.', Sagittarius: 'This is Jupiter\'s home. Growth, luck, and expansion come naturally to you. Travel, philosophy, and big-picture thinking are your superpowers.', Capricorn: 'Growth comes through discipline, structure, and long-term strategy. Your abundance builds slowly but becomes formidable over time.', Aquarius: 'You expand through innovation, community, and humanitarian vision. Your growth is tied to serving something bigger than yourself.', Pisces: 'Growth comes through spiritual connection, creativity, and compassion. Your abundance flows when you trust the unseen and follow your intuition.' },
  saturn: { Aries: 'Your life lesson is about healthy assertion. You\'re learning to lead with confidence rather than aggression or avoidance.', Taurus: 'Your lesson is about true security — building value without clinging. You\'re mastering the difference between having and hoarding.', Gemini: 'Your lesson is about focused communication. You\'re learning to commit to ideas, finish what you start, and speak with authority.', Cancer: 'Your lesson is around emotional boundaries. You\'re learning to nurture without losing yourself and to need without being needy.', Leo: 'Your lesson is about authentic self-expression without needing external validation. You\'re learning that real confidence doesn\'t require applause.', Virgo: 'Your lesson is about imperfection. You\'re mastering when "good enough" actually is — and releasing the anxiety of never measuring up.', Libra: 'Your lesson is about standing alone within partnership. You\'re learning that true balance means being whole yourself, not just keeping peace.', Scorpio: 'Your lesson involves power and control. You\'re learning to transform without manipulation and to be vulnerable without fear of destruction.', Sagittarius: 'Your lesson is about grounded wisdom. You\'re learning that freedom requires structure and that real truth is earned through discipline.', Capricorn: 'Saturn is at home here. Your lesson is about building real authority through integrity. You take responsibility seriously — the payoff is enormous.', Aquarius: 'Your lesson is about community with structure. You\'re learning to innovate within systems and to rebel with purpose, not just principle.', Pisces: 'Your lesson is about spiritual discipline. You\'re learning to ground your intuition, set boundaries with your empathy, and make dreams real.' },
  uranus: { Aries: 'You\'re wired for revolutionary independence. Sudden breakthroughs come through bold, pioneering action.', Taurus: 'You shake up the material world — finances, values, and physical reality get unexpected upgrades and disruptions.', Gemini: 'Your mind generates lightning-bolt ideas. Communication and technology are your channels for innovation.', Cancer: 'Your emotional world and home life undergo sudden shifts. You redefine family and belonging on your own terms.', Leo: 'You reinvent creative expression and identity. You refuse to perform someone else\'s script — your authenticity is electric.', Virgo: 'You revolutionize health, work, and daily systems. You find genius in the details everyone else ignores.', Libra: 'You reinvent relationships and partnerships. Traditional models don\'t contain you — love and collaboration need freedom.', Scorpio: 'You transform the taboo. Power dynamics, psychology, and hidden structures get blown open by your insight.', Sagittarius: 'You revolutionize beliefs, education, and travel. Your vision of truth shatters old philosophical boxes.', Capricorn: 'You disrupt institutions, authority, and career structures. You build new systems to replace the ones that failed.', Aquarius: 'Uranus is at home here. You\'re a natural disruptor — technology, community, and the future are your playground.', Pisces: 'You experience sudden spiritual awakenings and creative breakthroughs. The unseen world breaks through in unexpected ways.' },
  neptune: { Aries: 'Your spiritual path involves dissolving ego and finding the divine in action and leadership.', Taurus: 'Beauty becomes transcendent. You experience the spiritual through nature, art, and the sensory world.', Gemini: 'Your intuition expresses through words, ideas, and communication. You channel messages others can\'t articulate.', Cancer: 'Your empathy is oceanic. Home and family carry a spiritual quality — you feel the emotional undercurrents of everything.', Leo: 'Your creative expression is divinely inspired. Performance, art, and self-expression become spiritual acts.', Virgo: 'Your service carries a healing quality. You dissolve the line between practical help and spiritual ministry.', Libra: 'Your relationships carry a soul-level quality. You see the divine in others and pursue love as a transcendent experience.', Scorpio: 'Your transformation runs impossibly deep. You access psychological and spiritual depths that can heal or overwhelm.', Sagittarius: 'Your search for meaning becomes a spiritual quest. You dissolve the boundaries between philosophy and mysticism.', Capricorn: 'You bring dreams into structure. Your career and ambitions carry a spiritual dimension that others struggle to see.', Aquarius: 'Your vision for the future is inspired by something beyond logic. Community and innovation become channels for transcendence.', Pisces: 'Neptune is at home here. Your intuition, creativity, and spiritual connection are at maximum strength. The veil is thin for you.' },
  pluto: { Aries: 'You transform through radical independence. Death and rebirth cycles happen around identity, leadership, and the courage to begin again.', Taurus: 'You transform through values, money, and the material world. Your relationship with resources undergoes profound shifts.', Gemini: 'Transformation comes through information, communication, and how you think. Ideas have the power to completely remake your reality.', Cancer: 'Family, home, and emotional foundations undergo deep transformation. Your relationship with belonging is being fundamentally rewritten.', Leo: 'Your creative identity and self-expression undergo profound transformation. Who you think you are dies and is reborn.', Virgo: 'Your approach to work, health, and service gets completely dismantled and rebuilt. Perfectionism transforms into genuine mastery.', Libra: 'Relationships are your transformation ground. Partnerships die, evolve, or completely shift your understanding of love and equality.', Scorpio: 'Pluto is at home here. Transformation is your constant. You die and are reborn many times — each version of you more powerful than the last.', Sagittarius: 'Your beliefs, worldview, and understanding of truth undergo total transformation. What you thought was true gets demolished and rebuilt.', Capricorn: 'Career, ambition, and your relationship with power undergo radical transformation. Old structures fall so new ones can be built.', Aquarius: 'Community, technology, and your vision for the future undergo deep transformation. The systems you believed in get fundamentally reshaped.', Pisces: 'Spirituality, creativity, and your connection to the collective unconscious undergo profound transformation. Old spiritual frameworks dissolve.' },
  north_node: { Aries: 'Your soul is learning to lead, act independently, and put yourself first — after lifetimes of compromising for others.', Taurus: 'Your soul is learning to build stability, trust the physical world, and find peace — after lifetimes of intensity and crisis.', Gemini: 'Your soul is learning to be curious, communicative, and adaptable — after lifetimes of rigid belief systems.', Cancer: 'Your soul is learning vulnerability, emotional connection, and nurturing — after lifetimes of stoic self-reliance.', Leo: 'Your soul is learning to shine, create, and take center stage — after lifetimes of hiding in the group.', Virgo: 'Your soul is learning discernment, practical service, and attention to detail — after lifetimes of escapism and idealism.', Libra: 'Your soul is learning partnership, diplomacy, and seeing the other — after lifetimes of going it alone.', Scorpio: 'Your soul is learning to go deep, merge with others, and embrace transformation — after lifetimes of comfort-seeking.', Sagittarius: 'Your soul is learning to seek higher truth, explore, and find meaning — after lifetimes of surface-level information.', Capricorn: 'Your soul is learning discipline, authority, and long-term building — after lifetimes of emotional dependency.', Aquarius: 'Your soul is learning to serve the collective, innovate, and detach — after lifetimes of personal drama and ego.', Pisces: 'Your soul is learning to surrender, trust the universe, and dissolve ego — after lifetimes of over-control and analysis.' },
  chiron: { Aries: 'Your deepest wound is around your right to exist and assert yourself. Your healing gift: teaching others to be brave.', Taurus: 'Your deepest wound is around self-worth and material security. Your healing gift: showing others their inherent value.', Gemini: 'Your deepest wound is around your voice and intelligence. Your healing gift: helping others find their words.', Cancer: 'Your deepest wound is around belonging and emotional safety. Your healing gift: creating home for the homeless hearts.', Leo: 'Your deepest wound is around being seen and valued. Your healing gift: helping others shine without shame.', Virgo: 'Your deepest wound is around being "enough." Your healing gift: showing others that imperfection is human, not failure.', Libra: 'Your deepest wound is around relationships and rejection. Your healing gift: teaching others about healthy love and partnership.', Scorpio: 'Your deepest wound is around trust, power, and betrayal. Your healing gift: guiding others through their darkest transformations.', Sagittarius: 'Your deepest wound is around meaning and belief. Your healing gift: helping others find their own truth.', Capricorn: 'Your deepest wound is around achievement and recognition. Your healing gift: showing others that worth isn\'t measured by status.', Aquarius: 'Your deepest wound is around belonging and being different. Your healing gift: showing others that their uniqueness is their power.', Pisces: 'Your deepest wound is around spiritual disconnection or overwhelm. Your healing gift: holding space for others\' pain and transcendence.' },
};

// Get sign-specific interpretation for a planet placement
function getPlacementInsight(planet, sign) {
  if (PLANET_IN_SIGN[planet] && PLANET_IN_SIGN[planet][sign]) return PLANET_IN_SIGN[planet][sign];
  return PLANET_MEANINGS[planet] ? PLANET_MEANINGS[planet].short : '';
}

// Transit meanings — sign-specific interpretations
const TRANSIT_IN_SIGN = {
  sun: { Aries: 'The Sun in Aries fires up your identity and courage. This is "main character energy" season — time to initiate, lead, and put yourself first without apology.', Taurus: 'The Sun in Taurus grounds everything in pleasure and persistence. Slow down, savor, build. This transit rewards patience and sensory presence.', Gemini: 'The Sun in Gemini lights up communication and curiosity. Your mind is running multiple tabs — social energy is high, conversations are electric.', Cancer: 'The Sun in Cancer brings focus to home, family, and emotional foundations. Nurture your roots. The world can wait while you tend to what matters.', Leo: 'The Sun in Leo cranks up creativity, drama, and self-expression to maximum. Time to be seen, create boldly, and lead with your heart.', Virgo: 'The Sun in Virgo sharpens your attention to detail and desire to serve. Organize, optimize, and refine. Small improvements create massive shifts.', Libra: 'The Sun in Libra spotlights partnerships, beauty, and balance. Relationships are in focus — seek harmony, create beauty, and find your other half.', Scorpio: 'The Sun in Scorpio pulls everything to the depths. Intensity rises, secrets surface, and transformation becomes unavoidable. Go deep or go home.', Sagittarius: 'The Sun in Sagittarius expands your horizons. Adventure calls, big ideas flow, and the quest for meaning takes over. Think bigger than you dare.', Capricorn: 'The Sun in Capricorn puts ambition and discipline front and center. Build, commit, and take your career seriously. The mountain is worth climbing.', Aquarius: 'The Sun in Aquarius activates your inner rebel and visionary. Question everything, connect with your community, and innovate without permission.', Pisces: 'The Sun in Pisces dissolves boundaries and heightens intuition. Dreams feel louder, empathy runs deep, and the spiritual world pulls you in.' },
  moon: { Aries: 'The Moon in Aries charges emotions with impatience and fire. Act on instinct today, but watch for snap reactions. Channel the heat into something physical.', Taurus: 'The Moon in Taurus craves comfort and stability. Cook something beautiful, nest at home, and slow way down. Emotional security comes through the senses.', Gemini: 'The Moon in Gemini makes feelings chatty. Process emotions through conversation, writing, or learning something new. Restlessness is the undercurrent.', Cancer: 'The Moon in Cancer amplifies every feeling. Sensitivity is maxed out — nurture yourself and others. Tears might come easily, and that\'s okay.', Leo: 'The Moon in Leo wants to be celebrated. Emotions are big and dramatic today. Express how you feel boldly — don\'t dim your light for anyone.', Virgo: 'The Moon in Virgo channels emotions into productivity. You feel better when things are organized. Self-criticism might spike — be kind to yourself.', Libra: 'The Moon in Libra seeks harmony and connection. Relationship dynamics are front and center. The need for peace and beauty is strong.', Scorpio: 'The Moon in Scorpio intensifies everything emotional. Hidden feelings surface, jealousy might stir, but so does profound intimacy and truth.', Sagittarius: 'The Moon in Sagittarius lifts the emotional mood with optimism and humor. You need freedom, adventure, and philosophical perspective today.', Capricorn: 'The Moon in Capricorn adds emotional discipline. Feelings are managed, not expressed. Focus on responsibilities — emotional satisfaction comes through accomplishment.', Aquarius: 'The Moon in Aquarius creates emotional distance — you observe feelings more than you feel them. Social consciousness and independence are heightened.', Pisces: 'The Moon in Pisces dissolves emotional walls completely. Dreams are vivid, empathy is overwhelming, and creative inspiration flows freely.' },
  mercury: { Aries: 'Mercury in Aries makes thinking bold and impulsive. Communication is direct, debates are fiery, and patience for long explanations drops to zero.', Taurus: 'Mercury in Taurus slows thinking down in the best way. Ideas are practical, words carry weight, and decisions are made with deliberate care.', Gemini: 'Mercury is at home in Gemini — communication is rapid, brilliant, and multidirectional. Ideas flow freely, social connections spark, and mental energy peaks.', Cancer: 'Mercury in Cancer filters every thought through emotion. Communication becomes intuitive, memory-driven, and deeply personal. Words carry feeling.', Leo: 'Mercury in Leo makes communication dramatic and confident. You speak with authority, tell compelling stories, and think in terms of vision and leadership.', Virgo: 'Mercury is at home in Virgo — analytical thinking is precise, practical, and detail-oriented. It\'s the perfect transit for editing, organizing, and problem-solving.', Libra: 'Mercury in Libra brings diplomatic thinking. Every angle gets considered, communication is graceful, and the mind seeks fairness over speed.', Scorpio: 'Mercury in Scorpio turns the mind into a detective. Thinking goes deep, communication is strategic, and you can sense what\'s being left unsaid.', Sagittarius: 'Mercury in Sagittarius thinks in big pictures and bold ideas. Communication is enthusiastic and philosophical but may skip important fine print.', Capricorn: 'Mercury in Capricorn makes thinking strategic and purposeful. Communication is authoritative, plans are practical, and mental energy focuses on goals.', Aquarius: 'Mercury in Aquarius electrifies thinking. Ideas are innovative, unconventional, and future-oriented. Communication challenges the status quo.', Pisces: 'Mercury in Pisces makes thinking dreamy and intuitive. Logic takes a backseat to imagination. Communication works best through metaphor and feeling.' },
  venus: { Aries: 'Venus in Aries brings passionate, impulsive love energy. Attraction is instant, pursuit is bold, and patience for slow romance drops to zero.', Taurus: 'Venus is at home in Taurus — pleasure, beauty, and sensuality peak. Indulge in luxury, savor meals, and let love be slow and physical.', Gemini: 'Venus in Gemini makes social connections sparkle. Flirting is witty, dating is fun, and you\'re attracted to the most interesting person in the room.', Cancer: 'Venus in Cancer deepens emotional bonds. Love becomes nurturing, intimate, and home-focused. You crave closeness and commitment.', Leo: 'Venus in Leo makes love dramatic, generous, and performative. Romance wants grand gestures, creativity wants an audience, and hearts run hot.', Virgo: 'Venus in Virgo expresses love through service and attention to detail. Romantic energy is practical — showing up reliably IS the love language.', Libra: 'Venus is at home in Libra — beauty, harmony, and partnership energy are at their peak. Relationships smooth out, aesthetics sharpen, and charm flows.', Scorpio: 'Venus in Scorpio turns attraction intense and magnetic. Love is all-or-nothing, desire runs deep, and superficial connections feel intolerable.', Sagittarius: 'Venus in Sagittarius brings adventurous, freedom-loving romantic energy. Love feels expansive. Attraction to foreign, philosophical, or unconventional people rises.', Capricorn: 'Venus in Capricorn approaches love seriously. Attraction favors ambition and stability. Relationships that are going somewhere real get stronger.', Aquarius: 'Venus in Aquarius brings unconventional attraction. You\'re drawn to unique minds and independent spirits. Traditional romance feels too small.', Pisces: 'Venus is exalted in Pisces — love energy is at its most spiritual, romantic, and selfless. Every connection feels fated. Art and beauty transcend the ordinary.' },
  mars: { Aries: 'Mars is at home in Aries — energy, courage, and drive are at full power. Take action, start things, compete boldly. This is the most dynamic transit for getting things done.', Taurus: 'Mars in Taurus channels energy into steady, persistent work. Progress is slow but unstoppable. Stubbornness peaks alongside determination.', Gemini: 'Mars in Gemini scatters energy across multiple projects and conversations. Mental fight replaces physical fight. Arguments sharpen, multitasking intensifies.', Cancer: 'Mars in Cancer energizes emotions and protective instincts. Drive is fueled by feeling. Passive aggression may surface — channel the energy into nurturing.', Leo: 'Mars in Leo fires up creativity, confidence, and competitive pride. Energy is theatrical, bold, and demands recognition. Lead loudly.', Virgo: 'Mars in Virgo channels energy into precision work and problem-solving. Productivity peaks but so does irritation with imperfection.', Libra: 'Mars in Libra directs energy toward fairness and partnership. Action is diplomatic but decisiveness suffers. Fight for balance, not just peace.', Scorpio: 'Mars is at home in Scorpio — intensity, strategy, and willpower peak. You pursue goals with relentless focus. Nothing can stop you when you lock in.', Sagittarius: 'Mars in Sagittarius ignites adventurous energy and philosophical drive. Action is expansive, impatient, and aimed at bigger horizons.', Capricorn: 'Mars is exalted in Capricorn — ambitious energy is strategic, disciplined, and laser-focused on long-term results. Career drives intensify.', Aquarius: 'Mars in Aquarius channels energy into innovation and collective action. You fight for ideas and causes rather than personal gain.', Pisces: 'Mars in Pisces creates fluid, intuitive energy. Drive works through creativity and compassion rather than force. Action follows feeling.' },
  jupiter: { Aries: 'Jupiter in Aries expands confidence and independence. Lucky breaks come through bold action and pioneering spirit.', Taurus: 'Jupiter in Taurus grows wealth and material comfort. Abundance comes through patience, persistence, and investing in quality.', Gemini: 'Jupiter in Gemini expands social networks and knowledge. Growth comes through learning, communicating, and staying curious.', Cancer: 'Jupiter in Cancer expands emotional wisdom and family blessings. Growth comes through nurturing others and building home.', Leo: 'Jupiter in Leo amplifies creative self-expression and generosity. Growth comes through performing, creating, and leading with heart.', Virgo: 'Jupiter in Virgo expands through service and mastery of craft. Growth comes through helping others and perfecting your skills.', Libra: 'Jupiter in Libra grows through partnerships and diplomacy. Lucky breaks come through relationships and artistic collaboration.', Scorpio: 'Jupiter in Scorpio expands through deep transformation. Growth comes through research, shared resources, and facing the shadow.', Sagittarius: 'Jupiter is at home — maximum expansion, luck, and wisdom. Travel, higher learning, and philosophical breakthroughs are amplified.', Capricorn: 'Jupiter in Capricorn grows through discipline and long-term planning. Expansion is structured and reward comes through patience.', Aquarius: 'Jupiter in Aquarius expands humanitarian vision and innovation. Growth comes through technology, community, and forward-thinking ideas.', Pisces: 'Jupiter in Pisces expands spiritual connection and compassion. Growth comes through surrendering control and trusting the universe.' },
  saturn: { Aries: 'Saturn in Aries tests your independence and self-assertion. Discipline is required around how you lead and fight for yourself.', Taurus: 'Saturn in Taurus tests your relationship with security and material values. Financial discipline and patience are being demanded.', Gemini: 'Saturn in Gemini tests your communication and intellectual commitments. Focused thinking and follow-through are being demanded.', Cancer: 'Saturn in Cancer tests your emotional boundaries and family structures. Maturity around vulnerability is being demanded.', Leo: 'Saturn in Leo tests your creative confidence and need for recognition. Authentic self-expression requires discipline and humility.', Virgo: 'Saturn in Virgo tests your work ethic and health habits. Mastery of daily routines and practical service is being demanded.', Libra: 'Saturn in Libra tests your partnerships and sense of fairness. Commitment and accountability in relationships are being demanded.', Scorpio: 'Saturn in Scorpio tests your relationship with power and vulnerability. Deep emotional maturity and honest transformation are required.', Sagittarius: 'Saturn in Sagittarius tests your beliefs and freedom. Wisdom must be earned through discipline, not just proclaimed.', Capricorn: 'Saturn is at home — structures, careers, and authority are under maximum pressure. The demands are heavy but the foundations you build now last forever.', Aquarius: 'Saturn in Aquarius tests your community involvement and vision for the future. Innovation must be grounded in real commitment.', Pisces: 'Saturn in Pisces tests your spiritual life and boundaries with empathy. Faith requires structure and compassion needs limits.' },
  uranus: { Aries: 'Uranus in Aries brings sudden breakthroughs in identity and independence. Expect the unexpected in how you define yourself.', Taurus: 'Uranus in Taurus disrupts finances, values, and material stability. Revolutionary changes in how you earn, own, and value things.', Gemini: 'Uranus in Gemini electrifies communication and technology. Radical ideas and unexpected information change the game.', Cancer: 'Uranus in Cancer disrupts home and family structures. Sudden emotional shifts redefine where and how you belong.', Leo: 'Uranus in Leo revolutionizes creative expression and identity. Sudden breakthroughs in how you express your authentic self.', Virgo: 'Uranus in Virgo disrupts health and work systems. Innovative approaches to wellness and service create unexpected breakthroughs.', Libra: 'Uranus in Libra revolutionizes relationships. Sudden shifts in partnerships redefine how you connect and commit.', Scorpio: 'Uranus in Scorpio disrupts power dynamics and deep psychology. Hidden truths surface suddenly and transform everything.', Sagittarius: 'Uranus in Sagittarius revolutionizes beliefs and education. Sudden expansions of consciousness shatter old worldviews.', Capricorn: 'Uranus in Capricorn disrupts career structures and institutions. What seemed permanent suddenly crumbles and rebuilds.', Aquarius: 'Uranus is at home — technological and social revolution accelerates. The future arrives faster than anyone expected.', Pisces: 'Uranus in Pisces creates sudden spiritual awakenings. The boundary between seen and unseen reality dissolves unexpectedly.' },
  neptune: { Aries: 'Neptune in Aries dissolves ego boundaries around identity. The quest for self becomes a spiritual journey.', Taurus: 'Neptune in Taurus spiritualizes the material world. Beauty, nature, and sensory experience become doorways to transcendence.', Gemini: 'Neptune in Gemini dissolves the boundary between fact and fiction. Communication becomes poetic, confused, or divinely inspired.', Cancer: 'Neptune in Cancer heightens collective emotions and family bonds. Home becomes sanctuary, empathy becomes overwhelming.', Leo: 'Neptune in Leo makes creative expression feel channeled from something larger. Art, performance, and love take on spiritual dimensions.', Virgo: 'Neptune in Virgo spiritualizes service and health. Healing work becomes transcendent, and practical acts carry hidden grace.', Libra: 'Neptune in Libra idealizes relationships and beauty. Love feels fated, art feels transcendent, and the urge to merge is powerful.', Scorpio: 'Neptune in Scorpio dissolves into the depths of psychology and the occult. Transformation becomes a spiritual process, not just personal.', Sagittarius: 'Neptune in Sagittarius dissolves rigid beliefs. The search for truth becomes mystical and philosophical boundaries expand infinitely.', Capricorn: 'Neptune in Capricorn blurs the lines around career and ambition. Professional goals take on spiritual meaning or dissolve into confusion.', Aquarius: 'Neptune in Aquarius dissolves the boundary between individual and collective. Social ideals become spiritual and technology becomes mystical.', Pisces: 'Neptune is at home — spiritual sensitivity, artistic inspiration, and psychic perception are at maximum. The veil between worlds is thinnest.' },
  pluto: { Aries: 'Pluto in Aries transforms how you assert yourself and lead. Identity undergoes powerful death-and-rebirth cycles.', Taurus: 'Pluto in Taurus profoundly transforms your relationship with money, resources, and what you value at the deepest level.', Gemini: 'Pluto in Gemini transforms communication and thinking. Information becomes power, and the way you process reality fundamentally shifts.', Cancer: 'Pluto in Cancer transforms family dynamics and emotional foundations. Home, belonging, and security undergo deep restructuring.', Leo: 'Pluto in Leo transforms creative expression and identity. Who you are at your core dies and is reborn with more power.', Virgo: 'Pluto in Virgo transforms work, health, and service. Daily systems are dismantled and rebuilt from the ground up.', Libra: 'Pluto in Libra transforms relationships and partnerships. Love and connection undergo intense, irrevocable evolution.', Scorpio: 'Pluto is at home — transformation is total and relentless. Everything hidden surfaces, everything false dies. Power is absolute.', Sagittarius: 'Pluto in Sagittarius transforms beliefs and the search for truth. Entire worldviews die and are reborn.', Capricorn: 'Pluto in Capricorn transforms structures, institutions, and career. Old power systems crumble so something real can be built.', Aquarius: 'Pluto in Aquarius transforms technology, society, and collective consciousness. The future is being fundamentally restructured.', Pisces: 'Pluto in Pisces transforms spirituality and the collective unconscious. What humanity believes about reality itself undergoes death and rebirth.' },
};

// Get transit meaning — sign-specific if available
function getTransitMeaning(planet, sign) {
  if (TRANSIT_IN_SIGN[planet] && TRANSIT_IN_SIGN[planet][sign]) return TRANSIT_IN_SIGN[planet][sign];
  return `${PLANET_NAMES[planet]} is currently transiting through ${sign}, activating themes of ${sign.toLowerCase()} energy in the collective.`;
}

// House meaning labels
const HOUSE_LABELS = {
  1: { name: '1st House', area: 'Self & Identity' },
  2: { name: '2nd House', area: 'Money & Values' },
  3: { name: '3rd House', area: 'Communication & Mind' },
  4: { name: '4th House', area: 'Home & Family' },
  5: { name: '5th House', area: 'Creativity & Romance' },
  6: { name: '6th House', area: 'Health & Daily Work' },
  7: { name: '7th House', area: 'Partnerships & Love' },
  8: { name: '8th House', area: 'Transformation & Intimacy' },
  9: { name: '9th House', area: 'Travel & Higher Learning' },
  10: { name: '10th House', area: 'Career & Public Image' },
  11: { name: '11th House', area: 'Community & Future Vision' },
  12: { name: '12th House', area: 'Spirituality & the Unseen' },
};

// Country list for picker
// Country name → ISO code lookup (API requires 2-letter codes)
const COUNTRY_CODES = {
  'us': 'US', 'usa': 'US', 'united states': 'US', 'america': 'US',
  'uk': 'GB', 'united kingdom': 'GB', 'england': 'GB', 'britain': 'GB', 'great britain': 'GB', 'scotland': 'GB', 'wales': 'GB',
  'canada': 'CA', 'australia': 'AU', 'india': 'IN', 'germany': 'DE', 'deutschland': 'DE',
  'france': 'FR', 'brazil': 'BR', 'brasil': 'BR', 'mexico': 'MX', 'méxico': 'MX',
  'italy': 'IT', 'italia': 'IT', 'spain': 'ES', 'españa': 'ES', 'netherlands': 'NL', 'holland': 'NL',
  'japan': 'JP', 'south korea': 'KR', 'korea': 'KR', 'china': 'CN', 'russia': 'RU',
  'south africa': 'ZA', 'nigeria': 'NG', 'philippines': 'PH', 'colombia': 'CO',
  'argentina': 'AR', 'sweden': 'SE', 'norway': 'NO', 'denmark': 'DK',
  'ireland': 'IE', 'new zealand': 'NZ', 'portugal': 'PT', 'israel': 'IL',
  'uae': 'AE', 'united arab emirates': 'AE', 'singapore': 'SG', 'thailand': 'TH',
  'indonesia': 'ID', 'malaysia': 'MY', 'vietnam': 'VN', 'pakistan': 'PK',
  'bangladesh': 'BD', 'sri lanka': 'LK', 'nepal': 'NP', 'turkey': 'TR', 'türkiye': 'TR',
  'greece': 'GR', 'poland': 'PL', 'czech republic': 'CZ', 'czechia': 'CZ',
  'austria': 'AT', 'switzerland': 'CH', 'belgium': 'BE', 'finland': 'FI',
  'romania': 'RO', 'hungary': 'HU', 'ukraine': 'UA', 'egypt': 'EG',
  'morocco': 'MA', 'kenya': 'KE', 'ghana': 'GH', 'ethiopia': 'ET',
  'tanzania': 'TZ', 'uganda': 'UG', 'chile': 'CL', 'peru': 'PE',
  'venezuela': 'VE', 'ecuador': 'EC', 'cuba': 'CU', 'jamaica': 'JM',
  'puerto rico': 'PR', 'dominican republic': 'DO', 'costa rica': 'CR',
  'panama': 'PA', 'guatemala': 'GT', 'honduras': 'HN', 'el salvador': 'SV',
  'nicaragua': 'NI', 'bolivia': 'BO', 'paraguay': 'PY', 'uruguay': 'UY',
  'trinidad': 'TT', 'trinidad and tobago': 'TT', 'bahamas': 'BS',
  'iraq': 'IQ', 'iran': 'IR', 'saudi arabia': 'SA', 'qatar': 'QA',
  'kuwait': 'KW', 'jordan': 'JO', 'lebanon': 'LB', 'syria': 'SY',
  'afghanistan': 'AF', 'myanmar': 'MM', 'cambodia': 'KH', 'laos': 'LA',
  'taiwan': 'TW', 'hong kong': 'HK', 'macau': 'MO', 'mongolia': 'MN',
  'scotland': 'GB', 'northern ireland': 'GB',
};
function resolveCountryCode(input) {
  if (!input) return 'US';
  const trimmed = input.trim();
  // Already a 2-letter code
  if (trimmed.length === 2 && trimmed === trimmed.toUpperCase()) return trimmed;
  const lower = trimmed.toLowerCase();
  if (COUNTRY_CODES[lower]) return COUNTRY_CODES[lower];
  // Fuzzy: check if input starts with any known country
  for (const [name, code] of Object.entries(COUNTRY_CODES)) {
    if (lower.startsWith(name) || name.startsWith(lower)) return code;
  }
  // Last resort — return as-is and hope the API can handle it
  return trimmed;
}

function apiDataToPlanets(chartData) {
  if (!chartData || !chartData.tropical) return null;
  const order = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto','north_node','chiron'];
  return order.map(key => {
    const trop = chartData.tropical[key];
    const sid = chartData.sidereal ? chartData.sidereal[key] : null;
    if (!trop) return null;
    return {
      key, name: PLANET_NAMES[key], symbol: PLANET_SYMBOLS[key] || '✧',
      tropical: `${trop.sign} ${Math.round(trop.degree)}°`,
      sidereal: sid ? `${sid.sign} ${Math.round(sid.degree)}°` : 'N/A',
      tropicalData: trop, siderealData: sid,
      meaning: PLANET_MEANINGS[key] || { short: '', keywords: [] },
    };
  }).filter(Boolean);
}

function apiTransitsToDisplay(data) {
  if (!data || !data.tropical) return null;
  const order = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'];
  return order.map(key => {
    const t = data.tropical[key];
    if (!t) return null;
    return {
      key, planet: PLANET_NAMES[key], sign: t.sign, degree: Math.round(t.degree),
      symbol: PLANET_SYMBOLS[key], retrograde: t.retrograde,
      element: t.element, quality: t.quality, house: t.house,
      glyph: ZODIAC_GLYPHS[t.sign] || '✧',
      meaning: getTransitMeaning(key, t.sign),
    };
  }).filter(Boolean);
}

// ═══════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════
const C = {
  bg: '#0A0E17', bgCard: '#111827', bgElevated: '#0F1629',
  gold: '#D4A574', goldLight: '#E8C9A0', goldDim: 'rgba(212,165,116,0.15)',
  copper: '#C4956A', sage: '#7FA08A', sageLight: '#9BBEA6',
  cream: '#F0EBE3', creamDim: '#B8B0A4', muted: '#5A6B7D', mutedLight: '#7A8B9D',
  blush: '#D4A0A0', lavender: '#A8A0D4', error: '#D47A6A',
  border: 'rgba(212,165,116,0.12)', borderLight: 'rgba(212,165,116,0.06)',
  glow: 'rgba(212,165,116,0.08)',
  glassBg: 'rgba(17,24,39,0.85)', glassBorder: 'rgba(212,165,116,0.18)',
};

const F = {
  body: 'Inter_400Regular', bodyMed: 'Inter_500Medium', bodySemi: 'Inter_600SemiBold',
  display: 'BodoniModa_700Bold', displayMed: 'BodoniModa_500Medium',
  displaySemi: 'BodoniModa_600SemiBold', displayItalic: 'BodoniModa_400Regular_Italic',
  displayReg: 'BodoniModa_400Regular',
};

const { width: SW, height: SH } = Dimensions.get('window');

// ═══════════════════════════════════════════════
// VISUAL COMPONENTS
// ═══════════════════════════════════════════════
function Star({ x, y, size, color, delay }) {
  const op = useRef(new Animated.Value(0.1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(op, { toValue: 0.9, duration: 2000 + Math.random() * 3000, delay, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0.05, duration: 2000 + Math.random() * 3000, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: op }} />;
}
const STAR_COLORS = [C.gold, C.sage, C.cream, C.lavender, C.blush];
const STARS = Array.from({ length: 50 }, (_, i) => ({ id: i, x: Math.random() * SW, y: Math.random() * (SH + 400), size: Math.random() * 2 + 0.3, delay: Math.random() * 4000, color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)] }));
function StarField() { return <View style={StyleSheet.absoluteFill} pointerEvents="none">{STARS.map(s => <Star key={s.id} {...s} />)}</View>; }

function GlowOrb({ size = 200, color = C.glow, top, left, right, bottom }) {
  const pulse = useRef(new Animated.Value(0.3)).current;
  useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 0.6, duration: 5000, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0.3, duration: 5000, useNativeDriver: true })])).start(); }, []);
  return <Animated.View pointerEvents="none" style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: pulse, top, left, right, bottom }} />;
}

function CelestialDivider({ style }) {
  return <View style={[{ alignItems: 'center', marginVertical: 20 }, style]}><FadeImage source={IMG.celestialBanner} style={{ width: SW - 48, height: (SW - 48) * 0.35, opacity: 0.3 }} resizeMode="contain" /></View>;
}

function OrnateFrame({ children, style }) {
  return (
    <View style={[{ borderWidth: 1, borderColor: C.glassBorder, borderRadius: 20, padding: 20, backgroundColor: C.glassBg }, style]}>
      <View style={{ position: 'absolute', top: -5, left: 12 }}><IconStarDiamond size={10} color={C.gold} /></View>
      <View style={{ position: 'absolute', top: -5, right: 12 }}><IconStarDiamond size={10} color={C.gold} /></View>
      <View style={{ position: 'absolute', bottom: -5, left: 12 }}><IconStarDiamond size={10} color={C.gold} /></View>
      <View style={{ position: 'absolute', bottom: -5, right: 12 }}><IconStarDiamond size={10} color={C.gold} /></View>
      {children}
    </View>
  );
}

function GlassCard({ children, style, onPress }) {
  const W = onPress ? TouchableOpacity : View;
  return <W onPress={onPress} activeOpacity={0.7} style={[{ backgroundColor: C.glassBg, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.glassBorder }, style]}>{children}</W>;
}

function ZodiacBadge({ sign, size = 44 }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' }}><ZodiacIcon sign={sign} size={size * 0.5} color={C.gold} /></View>;
}

// ═══════════════════════════════════════════════
// CONSTELLATION CHART — Visual Spectacle Edition
// ═══════════════════════════════════════════════
function ConstellationChart({ planets, view }) {
  const chartSize = SW - 32;
  const cx = chartSize / 2; const cy = chartSize / 2;
  const outerR = chartSize / 2 - 6;
  const signR = outerR - 24;
  const planetR = signR - 26;
  const innerR = planetR - 22;
  const coreR = innerR - 18;
  const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  const parsePlacement = (str) => { const p = str.split(' '); return { sign: p[0], degree: parseInt(p[1]) || 0 }; };

  const rawPositions = planets.map(p => {
    const pl = view === 'The Surface' ? p.tropical : p.sidereal;
    const { sign, degree } = parsePlacement(pl);
    const idx = SIGNS.indexOf(sign);
    const totalDeg = idx * 30 + degree;
    const angle = (totalDeg * Math.PI / 180) - Math.PI / 2;
    return { ...p, sign, degree, totalDeg, angle };
  });

  const sortedByDeg = [...rawPositions].sort((a, b) => a.totalDeg - b.totalDeg);
  const positions = sortedByDeg.map((p, i) => {
    let r = planetR;
    for (let j = 0; j < sortedByDeg.length; j++) {
      if (i === j) continue;
      const diff = Math.abs(p.totalDeg - sortedByDeg[j].totalDeg);
      const minDiff = Math.min(diff, 360 - diff);
      if (minDiff < 10) { r = i % 2 === 0 ? planetR - 18 : planetR + 18; break; }
    }
    return { ...p, x: cx + Math.cos(p.angle) * r, y: cy + Math.sin(p.angle) * r, r };
  });

  const signPositions = SIGNS.map((s, i) => {
    const midA = ((i * 30 + 15) * Math.PI / 180) - Math.PI / 2;
    const labelR = (outerR + signR) / 2;
    return { sign: s, x: cx + Math.cos(midA) * labelR, y: cy + Math.sin(midA) * labelR };
  });

  // Element colors for sign band segments
  const SIGN_ELEMENTS = { Aries: '#D4A574', Taurus: '#7FA08A', Gemini: '#A8A0D4', Cancer: '#87CEEB', Leo: '#D4A574', Virgo: '#7FA08A', Libra: '#A8A0D4', Scorpio: '#87CEEB', Sagittarius: '#D4A574', Capricorn: '#7FA08A', Aquarius: '#A8A0D4', Pisces: '#87CEEB' };

  return (
    <View style={{ alignItems: 'center', marginVertical: 4 }}>
      {/* Background celestial art — more prominent */}
      <FadeImage source={IMG.chartHero} style={{ position: 'absolute', width: chartSize * 0.65, height: chartSize * 0.65, opacity: 0.18, top: chartSize * 0.18, borderRadius: chartSize * 0.33 }} resizeMode="cover" />
      <FadeImage source={IMG.zodiacWheel} style={{ position: 'absolute', width: chartSize * 0.4, height: chartSize * 0.4, opacity: 0.06, top: chartSize * 0.3 }} resizeMode="contain" />

      <View style={{ width: chartSize, height: chartSize }}>
        <Svg width={chartSize} height={chartSize}>
          <Defs>
            <RadialGradient id="chartGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={C.gold} stopOpacity="0.08" />
              <Stop offset="40%" stopColor={C.sage} stopOpacity="0.03" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={C.gold} stopOpacity="0.12" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Full background glow */}
          <Circle cx={cx} cy={cy} r={outerR + 12} fill="url(#chartGlow)" />

          {/* Ethereal outer glow ring */}
          <Circle cx={cx} cy={cy} r={outerR + 4} stroke={C.gold} strokeWidth={0.3} fill="none" opacity={0.08} />
          <Circle cx={cx} cy={cy} r={outerR + 2} stroke={C.gold} strokeWidth={0.2} fill="none" opacity={0.12} />

          {/* Outer ring — sign band */}
          <Circle cx={cx} cy={cy} r={outerR} stroke={C.gold} strokeWidth={0.9} fill="none" opacity={0.35} />
          <Circle cx={cx} cy={cy} r={signR} stroke={C.gold} strokeWidth={0.6} fill="none" opacity={0.25} />

          {/* Sign band — colored arc segments per element */}
          {SIGNS.map((s, i) => {
            const startA = (i * 30 * Math.PI / 180) - Math.PI / 2;
            const endA = ((i + 1) * 30 * Math.PI / 180) - Math.PI / 2;
            const midR = (outerR + signR) / 2;
            const arcW = outerR - signR;
            const sx = cx + Math.cos(startA) * midR;
            const sy = cy + Math.sin(startA) * midR;
            const ex = cx + Math.cos(endA) * midR;
            const ey = cy + Math.sin(endA) * midR;
            return (
              <G key={`seg${i}`}>
                {/* Colored element tint in sign band */}
                <Path d={`M ${cx + Math.cos(startA) * signR} ${cy + Math.sin(startA) * signR} A ${signR} ${signR} 0 0 1 ${cx + Math.cos(endA) * signR} ${cy + Math.sin(endA) * signR} L ${cx + Math.cos(endA) * outerR} ${cy + Math.sin(endA) * outerR} A ${outerR} ${outerR} 0 0 0 ${cx + Math.cos(startA) * outerR} ${cy + Math.sin(startA) * outerR} Z`} fill={SIGN_ELEMENTS[s]} opacity={0.04} />
                {/* Sign divider lines */}
                <Line x1={cx + Math.cos(startA) * signR} y1={cy + Math.sin(startA) * signR} x2={cx + Math.cos(startA) * outerR} y2={cy + Math.sin(startA) * outerR} stroke={C.gold} strokeWidth={0.5} opacity={0.2} />
              </G>
            );
          })}

          {/* Planet orbit ring — dotted */}
          <Circle cx={cx} cy={cy} r={planetR} stroke={C.gold} strokeWidth={0.4} fill="none" opacity={0.12} strokeDasharray="2,8" />

          {/* Inner decorative rings */}
          <Circle cx={cx} cy={cy} r={innerR} stroke={C.gold} strokeWidth={0.4} fill="none" opacity={0.18} />
          <Circle cx={cx} cy={cy} r={coreR} stroke={C.border} strokeWidth={0.3} fill="none" opacity={0.15} />

          {/* Core glow */}
          <Circle cx={cx} cy={cy} r={coreR} fill="url(#coreGlow)" />

          {/* Cross axis lines through center */}
          <Line x1={cx} y1={cy - coreR} x2={cx} y2={cy + coreR} stroke={C.gold} strokeWidth={0.3} opacity={0.1} />
          <Line x1={cx - coreR} y1={cy} x2={cx + coreR} y2={cy} stroke={C.gold} strokeWidth={0.3} opacity={0.1} />

          {/* Constellation lines connecting sequential planets */}
          {positions.map((p, i) => {
            const next = positions[(i + 1) % positions.length];
            return <Line key={`cl${i}`} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke={C.sage} strokeWidth={0.6} opacity={0.18} />;
          })}

          {/* Radial tick marks — minor degree markers */}
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i * 5 * Math.PI / 180) - Math.PI / 2;
            const isMajor = i % 6 === 0;
            const r1 = outerR;
            const r2 = outerR + (isMajor ? 4 : 2);
            return <Line key={`tick${i}`} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={C.gold} strokeWidth={isMajor ? 0.5 : 0.3} opacity={isMajor ? 0.2 : 0.1} />;
          })}

          {/* Planet glow halos on the SVG layer */}
          {positions.map(p => (
            <G key={`ph_${p.name}`}>
              <Circle cx={p.x} cy={p.y} r={18} fill={C.gold} opacity={0.04} />
              <Circle cx={p.x} cy={p.y} r={15} stroke={C.gold} strokeWidth={0.4} fill="none" opacity={0.12} />
            </G>
          ))}

          {/* Center star decoration */}
          <Circle cx={cx} cy={cy} r={5} fill={C.gold} opacity={0.08} />
          <Circle cx={cx} cy={cy} r={2} fill={C.gold} opacity={0.2} />
          <Path d={`M ${cx} ${cy - 6} L ${cx + 1.5} ${cy - 1.5} L ${cx + 6} ${cy} L ${cx + 1.5} ${cy + 1.5} L ${cx} ${cy + 6} L ${cx - 1.5} ${cy + 1.5} L ${cx - 6} ${cy} L ${cx - 1.5} ${cy - 1.5} Z`} fill={C.gold} opacity={0.1} />
        </Svg>

        {/* ── ZODIAC SIGN ICONS overlaid on the band ── */}
        {signPositions.map(sp => (
          <View key={`si_${sp.sign}`} style={{ position: 'absolute', left: sp.x - 11, top: sp.y - 11, width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
            <ZodiacIcon sign={sp.sign} size={15} color={C.creamDim} />
          </View>
        ))}

        {/* ── PLANET SYMBOL ICONS overlaid on the wheel ── */}
        {positions.map(p => (
          <View key={`pi_${p.name}`} style={{
            position: 'absolute', left: p.x - 15, top: p.y - 15,
            width: 30, height: 30, borderRadius: 15,
            backgroundColor: 'rgba(10,14,23,0.88)',
            borderWidth: 1.2, borderColor: 'rgba(212,165,116,0.45)',
            justifyContent: 'center', alignItems: 'center',
            shadowColor: C.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 6,
          }}>
            <PlanetIcon planet={p.key} size={17} color={C.gold} />
          </View>
        ))}
      </View>

      {/* ── Planet legend — rich grid with zodiac icons ── */}
      <View style={{ width: '100%', marginTop: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {positions.map(p => (
            <View key={p.name} style={{ width: '50%', paddingHorizontal: 4, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.glassBg, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 13, borderWidth: 1, borderColor: C.glassBorder }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.goldDim, justifyContent: 'center', alignItems: 'center', marginRight: 9, borderWidth: 1, borderColor: C.border }}>
                  <PlanetIcon planet={p.key} size={16} color={C.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.cream, fontSize: 11.5, fontFamily: F.bodySemi }}>{p.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <ZodiacIcon sign={p.sign} size={11} color={C.goldLight} />
                    <Text style={{ color: C.gold, fontSize: 10.5, fontFamily: F.body }}>{p.sign} {p.degree}°</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════
// FALLBACK DATA
// ═══════════════════════════════════════════════
const FALLBACK_PLANETS = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto','north_node','chiron'].map(k => ({
  key: k, name: PLANET_NAMES[k], symbol: PLANET_SYMBOLS[k],
  tropical: k === 'sun' ? 'Aries 15°' : k === 'moon' ? 'Cancer 22°' : 'Pisces 3°',
  sidereal: k === 'sun' ? 'Pisces 21°' : k === 'moon' ? 'Gemini 28°' : 'Aquarius 9°',
  meaning: PLANET_MEANINGS[k] || { short: '', keywords: [] },
}));

const DAILY_READINGS = {
  surface: "The simulation served up something interesting today. Mercury is running a sparkly new update in your communication code — things might get a little spicy. Your words have extra magic right now. Use them wisely, and maybe don't send that text at 2am.",
  depths: "Your deeper patterns are shifting today. The sidereal sky shows a quiet but powerful rearrangement in your emotional code. The Moon is whispering to Neptune — your intuition is running at full capacity. Trust what you feel, even if you can't explain it yet.",
  wholeStory: "Here's the full picture: what the world sees is Mercury giving your Surface a communication upgrade — you're sharper, wittier, more magnetic. But underneath, your Depths show the Moon whispering to Neptune, softening everything with intuition. You can be both brilliant AND gentle today.",
};

const COURSES = [
  { id: 'surface-depths', title: 'The Surface & The Depths', desc: 'Understand your two charts and why both matter', tag: 'Foundations', duration: '25 min',
    intro: 'Most astrology apps show you one chart. But you have two — and they tell very different stories. This course teaches you the difference between tropical and sidereal astrology, why both matter, and how FAIRY CODE weaves them together.',
    lessons: [
      { title: 'What Is Tropical Astrology?', body: 'Tropical astrology is based on the seasons. It locks the zodiac to the spring equinox — meaning 0° Aries always starts when spring begins in the Northern Hemisphere.\n\nThis system reflects your personality as the world sees it: your social identity, your ego, how you show up in everyday life. Think of it as your Surface code.\n\nWhen someone asks "what\'s your sign?" they\'re asking for your tropical Sun sign. It\'s the most popular system in Western astrology and it\'s been used for over 2,000 years.\n\nThe key insight: tropical astrology is about your relationship to the Earth\'s seasons and cycles. It\'s psychological, personality-driven, and immediate.' },
      { title: 'What Is Sidereal Astrology?', body: 'Sidereal astrology is based on the actual stars. It tracks where the constellations physically are in the sky right now, accounting for a phenomenon called precession — the slow wobble of Earth\'s axis that shifts the constellations about 1° every 72 years.\n\nThis means your sidereal chart is typically about 23-24° behind your tropical chart. If you\'re a tropical Aries, you might be a sidereal Pisces.\n\nSidereal astrology reveals your deeper patterns: your soul\'s code, your karmic wiring, the undercurrents running beneath the surface. In Vedic (Indian) astrology, this is the standard system.\n\nThe key insight: sidereal shows what\'s really running underneath — the Depths of who you are.' },
      { title: 'Why Your Signs Are Different', body: 'If you\'ve ever checked your Vedic chart and thought "wait, I\'m a completely different sign?" — you\'re not wrong.\n\nThe ~24° gap between tropical and sidereal means most people have at least a few planets in different signs across their two charts. This isn\'t an error. Both are valid, astronomically precise systems that simply measure different things.\n\nTropical measures: your relationship to Earth\'s seasonal cycle.\nSidereal measures: your relationship to the fixed stars.\n\nThat gap — called the ayanamsa — is why you might feel like "both and neither" when reading your horoscope. You\'re literally coded with two layers of celestial information.' },
      { title: 'The Surface: Your Outer Code', body: 'Your tropical chart — what we call The Surface — is the part of you that faces the world. It governs:\n\n• How you present yourself to others\n• Your conscious personality traits\n• Your ego structure and willpower\n• How you communicate and socialize\n• Your immediate emotional reactions\n\nWhen you read your tropical horoscope and it resonates, that\'s The Surface speaking. It\'s accurate because it\'s describing the layer of you that interacts with everyday life.\n\nThink of it like your user interface — it\'s real, it\'s functional, and it shapes how others experience you.' },
      { title: 'The Depths: Your Inner Code', body: 'Your sidereal chart — The Depths — reveals the operating system running underneath. It governs:\n\n• Your soul\'s deeper patterns and purpose\n• Karmic themes and past-life tendencies\n• Unconscious drives and hidden motivations\n• Your spiritual growth trajectory\n• The things you "just know" without knowing why\n\nThe Depths often explains those parts of yourself that don\'t match your Sun sign description. That unexplained pull toward certain things? That\'s likely your sidereal chart whispering.\n\nThis is the code beneath the code — the deeper truth of your cosmic programming.' },
      { title: 'Your Whole Story', body: 'Here\'s where it gets magical: Your Whole Story is what happens when Surface meets Depths.\n\nImagine your tropical chart as the lyrics of a song and your sidereal chart as the melody. Separately, each is meaningful. Together, they create something completely unique to you.\n\nFor example: a tropical Gemini Sun (Surface: curious, communicative, adaptable) with a sidereal Taurus Sun (Depths: grounded, loyal, sensory) creates someone who appears quick and social but is actually deeply rooted and consistent underneath.\n\nFAIRY CODE is built to read both charts simultaneously — so you\'re never getting half the story. When you toggle to "Your Whole Story," you\'re seeing the full truth of your cosmic code.' },
    ]},
  { id: 'planets-decoded', title: 'The Planets, Decoded', desc: 'Every planet in your chart and what it\'s really doing', tag: 'Foundations', duration: '45 min',
    intro: 'The planets are the actors in your cosmic story. Each one governs a different dimension of your life — from how you love to how you fight, from what you fear to what you\'re destined to become. This course breaks down every planet in plain language.',
    lessons: [
      { title: 'The Sun: Your Core Identity', body: 'The Sun is the main character of your chart. It represents your ego, your life force, your fundamental sense of "I am."\n\nIn tropical (Surface): Your Sun sign is how you express yourself in the world. It\'s your conscious identity — the traits you recognize and own.\n\nIn sidereal (Depths): Your Sun reveals your soul\'s essential nature. It\'s the deeper "why" behind who you are.\n\nThe Sun rules Leo, governs the heart, and its house placement shows where you need to shine and be seen. If your Sun is in the 10th house, your identity is tied to career and public recognition. In the 4th, it\'s tied to family and home.\n\nKey question: Where do I need to be most authentically myself?' },
      { title: 'The Moon: Your Emotional World', body: 'If the Sun is who you are, the Moon is how you feel. It governs your emotions, instincts, comfort needs, and the person you are when nobody\'s watching.\n\nYour Moon sign determines:\n• What makes you feel safe and nurtured\n• How you process and express emotions\n• Your relationship with your mother or maternal figures\n• What you need to feel "at home"\n• Your gut instincts and intuitive responses\n\nThe Moon changes signs every 2.5 days, making it one of the most personal placements in your chart. Two people born a day apart can have very different Moon signs.\n\nKey question: What do I need to feel emotionally safe?' },
      { title: 'Mercury: How You Think & Speak', body: 'Mercury is your mind\'s operating system. It governs how you process information, communicate ideas, and make sense of the world.\n\nMercury rules both Gemini (social communication) and Virgo (analytical processing). Your Mercury sign reveals:\n• Your communication style (direct vs. diplomatic)\n• How you learn best (reading vs. doing vs. discussing)\n• Your sense of humor and wit\n• How you make decisions\n• Your relationship with technology and information\n\nMercury retrograde — yes, that famous transit — is when this planet appears to move backward, scrambling communications and tech. But it\'s also a powerful time to revise, rethink, and reconnect.\n\nKey question: How do I best communicate my truth?' },
      { title: 'Venus: Love, Beauty & Values', body: 'Venus is your love language written in the stars. She governs attraction, aesthetics, pleasure, money, and what you genuinely value.\n\nYour Venus sign shows:\n• How you express and receive love\n• Your aesthetic preferences and style\n• What you find beautiful and pleasurable\n• Your relationship with money and material things\n• What you attract (and what attracts you)\n\nVenus rules Taurus (sensual, material pleasure) and Libra (relational harmony, beauty). In your chart, Venus\'s house placement shows which area of life you most seek beauty and connection.\n\nA Venus in the 11th house finds love through friendships and community. A Venus in the 2nd house needs financial security to feel loved.\n\nKey question: What do I truly value, and how do I love?' },
      { title: 'Mars: Drive, Desire & Courage', body: 'Mars is your engine. It\'s raw energy, ambition, sexuality, anger, and the courage to go after what you want. Where Venus attracts, Mars pursues.\n\nYour Mars sign reveals:\n• How you take action and assert yourself\n• Your fighting style and temper\n• What drives your ambition\n• Your physical energy and exercise preferences\n• Your sexual energy and desire nature\n\nMars rules Aries (direct, impulsive action) and traditionally Scorpio (strategic, intense power). Mars takes about 2 years to orbit the Sun, spending roughly 6 weeks in each sign.\n\nMars in fire signs (Aries, Leo, Sagittarius) acts fast and bold. Mars in water signs (Cancer, Scorpio, Pisces) acts from emotional instinct. Mars in earth signs (Taurus, Virgo, Capricorn) is steady and persistent. Mars in air signs (Gemini, Libra, Aquarius) acts through ideas and communication.\n\nKey question: How do I fight for what I want?' },
      { title: 'Jupiter: Growth & Expansion', body: 'Jupiter is the great benefic — the planet of luck, growth, wisdom, and expansion. Wherever Jupiter sits in your chart, things tend to come easier and bigger.\n\nYour Jupiter sign and house show:\n• Where you experience natural abundance\n• Your path to wisdom and higher learning\n• How you grow philosophically and spiritually\n• Where you might overdo it (Jupiter expands everything)\n• Your relationship with faith and optimism\n\nJupiter takes 12 years to orbit, spending about 1 year in each sign. This is why your "Jupiter return" at ages 12, 24, 36, 48 etc. marks major growth periods.\n\nJupiter in the 9th house loves travel and philosophy. In the 2nd, it brings financial abundance. In the 7th, relationships are the source of growth.\n\nKey question: Where is my greatest potential for growth?' },
      { title: 'Saturn: Discipline & Life Lessons', body: 'Saturn is the great teacher — strict, demanding, but ultimately the planet that builds lasting success. Saturn represents structure, discipline, limits, responsibility, and time.\n\nYour Saturn sign and house reveal:\n• Your biggest life lessons and challenges\n• Where you need to develop mastery through hard work\n• Your relationship with authority and rules\n• Fears and insecurities you\'re meant to overcome\n• Where delayed gratification pays off most\n\nSaturn takes 29.5 years to orbit, creating the famous "Saturn return" around ages 28-30 and 57-60 — periods of major restructuring.\n\nSaturn in the 10th house demands career mastery. In the 7th, relationships require serious commitment to work. In the 1st, the lesson is learning to trust yourself.\n\nKey question: What am I here to master, even when it\'s hard?' },
      { title: 'The Outer Planets: Uranus, Neptune & Pluto', body: 'The outer planets move slowly and affect entire generations. But their house placement in YOUR chart makes them deeply personal.\n\nUranus (84-year orbit) — The Awakener\nBreakthroughs, rebellion, innovation, sudden change. Where Uranus sits shows where you need freedom and where life delivers unexpected plot twists.\n\nNeptune (165-year orbit) — The Dreamer\nSpiritual connection, intuition, illusion, creativity, and transcendence. Neptune\'s placement shows where you access the divine — and where you might lose yourself in fantasy.\n\nPluto (248-year orbit) — The Transformer\nPower, death and rebirth, shadow work, deep psychological transformation. Pluto\'s house shows where you\'ll undergo the most profound and irreversible changes.\n\nThese planets define your generation\'s themes while personalizing them through your unique chart placement.' },
      { title: 'North Node & Chiron: Destiny & Healing', body: 'These aren\'t planets — they\'re mathematical points and asteroids — but they\'re among the most powerful placements in your chart.\n\nThe North Node (True Node)\nYour soul\'s compass. It points toward what you\'re growing into in this lifetime — the qualities that feel unfamiliar but deeply fulfilling. The South Node (opposite sign) shows your comfort zone and past-life gifts.\n\nNorth Node in Aries: Learning independence. South Node in Libra: Defaulting to people-pleasing.\nNorth Node in Cancer: Learning emotional vulnerability. South Node in Capricorn: Defaulting to stoic self-reliance.\n\nChiron — The Wounded Healer\nChiron shows your deepest wound — and your greatest gift for helping others. It\'s the place where you hurt most, but through healing that wound, you become a source of wisdom for others.\n\nChiron in the 3rd house: wounds around communication. Once healed, you help others find their voice.' },
    ]},
  { id: 'transit-weather', title: 'Transit Weather', desc: 'How to read the cosmic weather report like a pro', tag: 'Advanced', duration: '20 min',
    intro: 'Transits are the planets moving through the sky right now, activating different parts of your birth chart. Understanding transits means you can anticipate life\'s rhythms instead of being surprised by them. This is the cosmic weather forecast.',
    lessons: [
      { title: 'What Are Transits?', body: 'Your birth chart is a snapshot of the sky at the exact moment you were born. But the planets didn\'t stop moving. Right now, as you read this, those same planets are continuing their orbits — forming new relationships with the positions in your birth chart.\n\nThese moving planets are called transits, and they\'re the mechanism behind "the cosmic weather." When transit Mars crosses your natal Venus, for example, your love life heats up. When transit Saturn hits your natal Sun, life gets serious and restructured.\n\nTransits are temporary. Some last hours (Moon), some last days (Sun, Mercury, Venus), some last weeks (Mars), and some last years (Saturn, Pluto). The slower the planet, the deeper the impact.\n\nThis is why understanding transits transforms astrology from "personality quiz" into a living, dynamic tool for navigating your actual life.' },
      { title: 'Fast Transits: Moon, Sun, Mercury & Venus', body: 'Fast-moving planets create the daily and weekly texture of your life.\n\nThe Moon (2.5 days per sign)\nThe Moon changes the emotional weather every few days. Moon in Cancer = everyone\'s more sensitive. Moon in Aries = energy spikes. Check the Moon sign to understand the emotional backdrop of your day.\n\nThe Sun (30 days per sign)\nThe Sun highlights a different area of life each month. When it transits your 7th house, relationships are in focus. Your 10th house? Career spotlight.\n\nMercury (15-60 days per sign)\nMercury governs communication cycles. When it retrogrades, plans and tech go haywire — but it\'s genius for revision. When direct, it\'s go-time for new ideas.\n\nVenus (23-60 days per sign)\nVenus cycles bring waves of pleasure, beauty, and social energy. Venus retrograde (every 18 months) is for reconsidering what you value and who you love.' },
      { title: 'Slow Transits: Mars Through Pluto', body: 'Slow planets are the heavy hitters. They don\'t just color your day — they reshape chapters of your life.\n\nMars (6 weeks per sign)\nMars transits energize whatever house they touch. Mars through your 1st house = you\'re fired up and taking initiative. Through your 12th = internal frustration that needs a physical outlet.\n\nJupiter (1 year per sign)\nJupiter\'s transit through a house brings growth and opportunity there for an entire year. Jupiter through your 2nd house = financial growth. Through your 9th = travel and education expand.\n\nSaturn (2.5 years per sign)\nSaturn transits are the "adulting" phases. Whatever house Saturn is transiting gets restructured. It\'s hard but builds something lasting.\n\nUranus, Neptune, Pluto (7-30 years per sign)\nThese reshape entire life chapters. Pluto transiting your 7th house transforms your relationship paradigm over many years. These are the big evolutionary arcs.' },
      { title: 'Reading Your Transit Forecast', body: 'Here\'s how to actually use transit information:\n\n1. Check the fast transits for daily planning. If Mercury is retrograde, maybe don\'t sign that contract today. If Venus is in your sign, lean into social events.\n\n2. Track slow transits for life chapters. Know which house Jupiter is lighting up — that\'s your growth zone for the year. Know where Saturn is — that\'s where you need to work harder.\n\n3. Watch for major transits to your natal planets. When a slow planet (Jupiter, Saturn, Uranus, Neptune, Pluto) makes an exact connection to one of your birth chart planets, that\'s a major life event window.\n\n4. Don\'t fear difficult transits. Saturn and Pluto transits are challenging but they\'re when the deepest growth happens. They\'re not punishments — they\'re initiations.\n\nFAIRY CODE\'s Today tab shows you these transits in real-time, so you always know what\'s activating in the cosmic weather.' },
    ]},
  { id: 'love-code', title: 'Your Love Code', desc: 'Venus, Mars, and the 7th house — your relationship blueprint', tag: 'Popular', duration: '30 min',
    intro: 'Your birth chart contains a complete love story. Venus shows how you love, Mars shows what you desire, and your 7th house reveals the partnerships you\'re drawn to. This course decodes your romantic wiring — and helps you understand others\' love codes too.',
    lessons: [
      { title: 'Venus: How You Love', body: 'Venus is the planet of love, beauty, and attraction. Your Venus sign is the single most revealing placement for understanding your romantic nature.\n\nVenus in Fire Signs (Aries, Leo, Sagittarius): Love is passionate, dramatic, and action-oriented. You fall fast, love big, and need excitement to stay interested. You show love through bold gestures and enthusiasm.\n\nVenus in Earth Signs (Taurus, Virgo, Capricorn): Love is sensual, steady, and expressed through actions. You show love by building something real — cooking dinner, being reliable, creating security.\n\nVenus in Air Signs (Gemini, Libra, Aquarius): Love is mental, communicative, and social. You need intellectual stimulation and great conversation. You show love through words, ideas, and shared experiences.\n\nVenus in Water Signs (Cancer, Scorpio, Pisces): Love is deep, emotional, and intuitive. You merge with your partner on a soul level. You show love through emotional attunement and devotion.' },
      { title: 'Mars: What You Desire', body: 'If Venus is how you attract, Mars is how you pursue. Mars governs sexual energy, passion, and the drive behind your desires.\n\nMars in Fire: Direct, passionate pursuit. You know what you want and you go after it. Physical chemistry is essential. You like the chase.\n\nMars in Earth: Slow, persistent pursuit. You build desire over time. Physical touch and sensuality matter more than flash. You\'re in it for the long game.\n\nMars in Air: Intellectual pursuit. You\'re attracted to minds first. Flirting, witty banter, and mental stimulation are your foreplay. You need variety.\n\nMars in Water: Emotional pursuit. You desire deep emotional and spiritual connection. Intensity matters more than frequency. You pursue with intuition, not logic.\n\nVenus + Mars together reveal your complete romantic signature: what you attract and what you chase.' },
      { title: 'The 7th House: Your Partnership Pattern', body: 'The 7th house in your chart is the house of committed partnerships, marriage, and one-on-one relationships. The sign on the cusp of your 7th house (your Descendant) reveals the type of partner you\'re magnetically drawn to.\n\nThe 7th house sign shows qualities you need in a partner — often qualities that balance your own Rising sign:\n• Aries Rising \u2192 Libra 7th house: You need a diplomatic, balanced partner\n• Taurus Rising \u2192 Scorpio 7th house: You need a deep, transformative partner\n• Gemini Rising \u2192 Sagittarius 7th house: You need an adventurous, philosophical partner\n\nPlanets IN your 7th house add more layers. Venus in the 7th = relationships come naturally and are central to your life. Saturn in the 7th = relationships require work but become deeply committed. Pluto in the 7th = intense, transformative partnerships.\n\nYour 7th house isn\'t just about who you love — it\'s about who you become through partnership.' },
      { title: 'The Moon & Emotional Compatibility', body: 'While Venus and Mars get the romantic headlines, the Moon is quietly the most important planet for long-term relationship success.\n\nYour Moon sign determines what you need to feel emotionally safe. In a relationship, if your Moon\'s needs aren\'t met, no amount of Venus chemistry will save it.\n\nMoon compatibility checklist:\n• Same element Moons (both in water signs, both in earth signs) naturally understand each other\'s emotional language\n• Your Moon and their Sun (or vice versa) = deeply nurturing connection\n• Your Moon and their Moon = emotional harmony or friction\n\nThe Surface (tropical) Moon shows your everyday emotional needs in relationships. The Depths (sidereal) Moon reveals the soul-level emotional patterns you bring to love.\n\nWhen both charts align — Surface and Depths — you\'ve found someone who meets you on every level. That\'s the Whole Story of love.' },
      { title: 'Synastry: Your Chart Meets Theirs', body: 'Synastry is the art of comparing two birth charts to understand relationship dynamics. It\'s where astrology gets really personal.\n\nThe most powerful synastry connections:\n• Sun-Moon aspects: One person\'s Sun lighting up the other\'s Moon = deep recognition\n• Venus-Mars aspects: Classic romantic and sexual attraction\n• Moon-Moon aspects: Emotional understanding (or emotional friction)\n• Saturn aspects: Staying power and commitment (can feel heavy but builds lasting bonds)\n• Pluto aspects: Intense, transformative, sometimes obsessive connections\n\nNot every aspect needs to be harmonious. Some tension (squares, oppositions) creates passion and growth. Too much ease (all trines) can lack spark.\n\nThe most fulfilling relationships usually have a mix: enough harmony to feel good, enough friction to keep growing together. Your love code isn\'t about finding someone "perfect" — it\'s about finding someone whose code dances with yours.' },
    ]},
  { id: 'moon-rhythm', title: 'The Moon\'s Rhythm', desc: 'New moons, full moons, and living in lunar time', tag: 'New', duration: '18 min',
    intro: 'The Moon is the fastest-moving celestial body in astrology, changing signs every 2.5 days and cycling through phases every 29.5 days. Learning to live with the Moon\'s rhythm means you can time your intentions, releases, and rest with cosmic precision.',
    lessons: [
      { title: 'The Lunar Cycle Explained', body: 'The Moon\'s 29.5-day cycle mirrors a complete creative process — from seed to bloom to release.\n\nNew Moon (Day 0): New beginnings, intention setting. The sky is dark, representing a blank slate. This is when you plant seeds — literal and metaphorical.\n\nWaxing Crescent (Days 1-7): Building momentum. Your intentions start taking shape. Take small actions toward your goals.\n\nFirst Quarter (Day 7): Challenge point. Obstacles arise that test your commitment. Push through or course-correct.\n\nWaxing Gibbous (Days 7-14): Refinement. Fine-tune your approach. The energy is building toward a peak.\n\nFull Moon (Day 14): Culmination, illumination, release. What you started at the New Moon reaches a climax. Emotions run high. Things are revealed.\n\nWaning Gibbous (Days 14-21): Gratitude and sharing. Distribute what you\'ve harvested.\n\nLast Quarter (Day 21): Release and let go. Clear out what\'s no longer serving you.\n\nBalsamic Moon (Days 21-29): Rest and surrender. The cycle is ending. Reflect, dream, prepare for the next seed.' },
      { title: 'New Moon Rituals', body: 'New Moons are the most powerful time to set intentions. The Moon is conjunct the Sun — your conscious will and unconscious needs are aligned.\n\nA simple New Moon practice:\n1. Check which sign the New Moon is in — this colors your intention. A New Moon in Aries = intentions around courage and new starts. In Taurus = financial and sensory goals.\n\n2. Check which house it falls in for YOUR chart — this shows the life area being activated.\n\n3. Write down 1-3 specific intentions. Be clear but leave room for magic. "I intend to feel confident speaking up at work" rather than "I intend to get a promotion by Friday."\n\n4. Create a small ritual: light a candle, sit quietly, read your intentions aloud. The ritual itself signals to your unconscious mind that this matters.\n\n5. Keep your intentions somewhere visible for the next 2 weeks leading to the Full Moon.\n\nThe New Moon in the sign of your natal Sun or Moon is especially potent for personal intentions.' },
      { title: 'Full Moon Release', body: 'Full Moons are the culmination point. The Moon is opposite the Sun — tension between your outer life and inner needs creates illumination. Things become clear. Secrets surface. Emotions peak.\n\nFull Moons are the time to:\n• Release what no longer serves you\n• Celebrate what\'s come to fruition\n• Have honest conversations that need to happen\n• Complete projects and close chapters\n• Practice forgiveness and letting go\n\nA simple Full Moon practice:\n1. Check what sign the Full Moon is in and what house it falls in your chart.\n\n2. Ask yourself: What has become clear since the New Moon 2 weeks ago? What am I holding onto that needs to be released?\n\n3. Write down what you\'re releasing. Be specific. "I release the belief that I\'m not good enough to charge premium prices."\n\n4. Symbolically let go: burn the paper (safely), tear it up, flush it, or simply speak it aloud and breathe it out.\n\nFull Moons in your sign are particularly powerful for personal breakthroughs and release.' },
      { title: 'Living in Lunar Time', body: 'Modern life runs on solar time — alarm clocks, calendars, 9-to-5 schedules. But your body and psyche respond to lunar time whether you notice it or not.\n\nPractical tips for living with the Moon:\n\nWaxing phase (New to Full): Best for starting projects, making pitches, sending outreach, building habits, socializing, saying yes.\n\nFull Moon: Best for launches, celebrations, important conversations, creative performances, and culminations.\n\nWaning phase (Full to New): Best for editing, cleaning, organizing, therapy, releasing bad habits, tying up loose ends, going inward.\n\nNew Moon: Best for rest, journaling, dreaming, planning (not executing), and intention-setting.\n\nAlso track the Moon sign each day:\n• Fire sign Moons (Aries, Leo, Sag): High energy, take action\n• Earth sign Moons (Taurus, Virgo, Cap): Productive, practical tasks\n• Air sign Moons (Gemini, Libra, Aquarius): Social, intellectual pursuits\n• Water sign Moons (Cancer, Scorpio, Pisces): Rest, feel, create\n\nFAIRY CODE\'s Today tab shows you the current Moon transit so you can tune into lunar time every day.' },
    ]},
  { id: 'houses-decoded', title: 'The 12 Houses', desc: 'The twelve areas of life your chart maps out', tag: 'Foundations', duration: '35 min',
    intro: 'If the planets are actors and the signs are costumes, the houses are the stages. The 12 houses in your chart divide life into twelve areas — from identity to career, from love to spirituality. Understanding houses unlocks what your chart is really saying.',
    lessons: [
      { title: 'Houses 1-3: Self, Money & Mind', body: 'The first three houses govern your most personal, immediate reality.\n\n1st House — The Self\nYour rising sign (ascendant) and the house of identity. This is how you appear to the world, your physical body, your first impression, and your instinctive approach to life. Planets here are extremely visible in your personality.\n\n2nd House — Resources & Values\nMoney, possessions, self-worth, and what you value. This house governs your earning ability, your relationship with material things, and your core sense of "am I enough?" Planets here shape your financial patterns and relationship with security.\n\n3rd House — Communication & Learning\nYour mind, siblings, neighbors, short trips, early education, and daily communication. This is how you think, speak, and process information on a day-to-day level. Planets here make you a natural communicator, writer, or teacher.\n\nThese houses are where life starts: who you are, what you have, and how you think.' },
      { title: 'Houses 4-6: Home, Heart & Health', body: 'The middle houses govern your roots, creative expression, and daily routines.\n\n4th House — Home & Family\nYour private life, roots, family of origin, emotional foundations, and where you retreat. The sign on the 4th house cusp (IC) reveals your deepest emotional needs and the energy of your home life. Planets here tie you closely to family themes.\n\n5th House — Creativity, Romance & Joy\nThe house of pleasure: dating (not marriage), children, creative projects, hobbies, and fun. This is where you play and create. Venus or Jupiter here = blessed in love affairs and creative expression. Saturn here = taking creativity seriously.\n\n6th House — Health, Work & Service\nDaily routines, health habits, work environment (not career — that\'s the 10th), and service to others. This house governs how you take care of yourself and show up in your daily responsibilities. Planets here often indicate sensitivity to health and a strong work ethic.\n\nThese houses are where life deepens: your roots, your joy, and your daily rhythm.' },
      { title: 'Houses 7-9: Partnerships, Power & Purpose', body: 'These houses govern your relationships with others and the wider world.\n\n7th House — Partnerships & Marriage\nCommitted one-on-one relationships, marriage, business partners, and open enemies. The sign on your 7th house (Descendant) shows what you need in a partner and what you attract. Planets here make partnerships a central life theme.\n\n8th House — Transformation & Shared Resources\nSex, death, rebirth, other people\'s money, inheritances, taxes, debts, and deep psychological transformation. This is the "underworld" of the chart. Planets here give you access to profound power and intense experiences. This is where you transform through merging with others.\n\n9th House — Higher Learning & Expansion\nTravel, higher education, philosophy, religion, publishing, and your search for meaning. The 9th house is your quest for truth — the things that expand your worldview. Planets here make you a seeker, teacher, or traveler.\n\nThese houses are where life expands: through partnership, depth, and seeking truth.' },
      { title: 'Houses 10-12: Legacy, Community & Spirit', body: 'The final three houses govern your place in the world and your connection to something greater.\n\n10th House — Career & Public Image\nThe Midheaven (MC), your career, reputation, public achievements, authority, and legacy. This is how the world remembers you. The sign on your MC reveals the energy of your ideal career path. Planets here strongly influence your professional life.\n\n11th House — Community & Future Vision\nFriendships, groups, social causes, networks, hopes, and dreams. This is where you belong to something larger than yourself. Planets here connect you to communities and give you a vision for the future. The 11th house is increasingly important in the social media age.\n\n12th House — The Unconscious & Spirituality\nThe hidden realm: your unconscious mind, spirituality, dreams, isolation, self-undoing, and transcendence. Planets in the 12th house are powerful but often operate behind the scenes. This house connects you to the collective unconscious and your deepest spiritual nature.\n\nThese houses are where life transcends: your contribution, your tribe, and your spiritual connection.' },
    ]},
];

// ═══════════════════════════════════════════════
// JOURNAL PROMPTS
// ═══════════════════════════════════════════════
const JOURNAL_PROMPTS = [
  { id: 1, theme: 'Sun', prompt: 'Where in your life are you being called to shine more authentically right now?', tags: ['Identity', 'Purpose'] },
  { id: 2, theme: 'Moon', prompt: 'What emotions came up for you today that you haven\'t given yourself space to feel?', tags: ['Emotions', 'Self-Care'] },
  { id: 3, theme: 'Mercury', prompt: 'What conversation have you been avoiding? What would you say if fear weren\'t a factor?', tags: ['Communication', 'Truth'] },
  { id: 4, theme: 'Venus', prompt: 'What brings you genuine pleasure that you\'ve been denying yourself lately?', tags: ['Love', 'Values'] },
  { id: 5, theme: 'Mars', prompt: 'What are you angry about — and what is that anger trying to protect?', tags: ['Drive', 'Boundaries'] },
  { id: 6, theme: 'Jupiter', prompt: 'What area of your life feels like it\'s expanding? Where is growth pulling you?', tags: ['Growth', 'Abundance'] },
  { id: 7, theme: 'Saturn', prompt: 'What discipline or commitment feels hard right now but you know is building something lasting?', tags: ['Discipline', 'Mastery'] },
  { id: 8, theme: 'Uranus', prompt: 'Where in your life do you feel the urge to break free from a pattern?', tags: ['Freedom', 'Change'] },
  { id: 9, theme: 'Neptune', prompt: 'What are you dreaming about that feels too big to say out loud?', tags: ['Dreams', 'Intuition'] },
  { id: 10, theme: 'Pluto', prompt: 'What part of your old self are you shedding? What\'s being reborn?', tags: ['Transformation', 'Shadow'] },
  { id: 11, theme: 'Chiron', prompt: 'Where does your deepest wound live — and how has it become your greatest teacher?', tags: ['Healing', 'Wisdom'] },
  { id: 12, theme: 'North Node', prompt: 'What feels uncomfortable but deeply right? What is your soul pulling you toward?', tags: ['Destiny', 'Evolution'] },
  { id: 13, theme: 'New Moon', prompt: 'If you could plant one seed of intention right now, what would it be?', tags: ['Intentions', 'Beginnings'] },
  { id: 14, theme: 'Full Moon', prompt: 'What has become illuminated for you recently? What are you ready to release?', tags: ['Release', 'Clarity'] },
  { id: 15, theme: 'Surface', prompt: 'How does the world see you — and how does that differ from who you really are?', tags: ['Identity', 'Perception'] },
  { id: 16, theme: 'Depths', prompt: 'What part of yourself do you keep hidden? What would happen if you let it breathe?', tags: ['Shadow', 'Authenticity'] },
  { id: 17, theme: 'Whole Story', prompt: 'When your Surface and your Depths are in harmony, what does that version of you look like?', tags: ['Integration', 'Wholeness'] },
  { id: 18, theme: 'Gratitude', prompt: 'Name three things the universe conspired to bring you today — big or small.', tags: ['Gratitude', 'Presence'] },
  { id: 19, theme: 'Intuition', prompt: 'Your body is telling you something right now. Close your eyes. What do you hear?', tags: ['Intuition', 'Body'] },
  { id: 20, theme: 'Love', prompt: 'Write a letter to someone you love — even if that someone is you.', tags: ['Love', 'Compassion'] },
];

function getDailyPrompt() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
}

// ═══════════════════════════════════════════════
// VIEW TOGGLE
// ═══════════════════════════════════════════════
function ViewToggle({ active, onSelect }) {
  const views = ['The Surface', 'The Depths', 'Your Whole Story'];
  return (
    <View style={{ flexDirection: 'row', backgroundColor: C.bgCard, borderRadius: 14, padding: 3, marginBottom: 20, borderWidth: 1, borderColor: C.borderLight }}>
      {views.map(v => <TouchableOpacity key={v} style={[{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' }, active === v && { backgroundColor: C.gold }]} onPress={() => onSelect(v)}><Text style={[{ fontSize: 12, fontFamily: F.bodySemi, color: C.muted }, active === v && { color: C.bg }]}>{v}</Text></TouchableOpacity>)}
    </View>
  );
}

// ═══════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════

function WelcomeScreen({ onNavigate }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeIn, { toValue: 1, duration: 1200, useNativeDriver: true }).start(); }, []);

  return (
    <ImageBackground source={IMG.welcomeHero} style={{ flex: 1 }} resizeMode="cover">
      <View style={{ flex: 1, backgroundColor: 'rgba(10,14,23,0.5)', justifyContent: 'flex-end', alignItems: 'center', padding: 32, paddingBottom: 60 }}>
        <Animated.View style={{ opacity: fadeIn, alignItems: 'center' }}>
          <View style={{ marginBottom: 16 }}><IconStarDiamond size={16} color={C.gold} /></View>
          <Text style={{ fontSize: 44, color: C.cream, fontFamily: F.display, textAlign: 'center', lineHeight: 50, marginBottom: 10 }}>
            FAIRY{'\n'}CODE
          </Text>
          <View style={{ width: 48, height: 1.5, backgroundColor: C.gold, marginBottom: 16 }} />
          <Text style={{ fontSize: 17, color: C.creamDim, fontFamily: F.displayItalic, textAlign: 'center', lineHeight: 26, marginBottom: 6 }}>
            Your stars wrote a story.{'\n'}Let's read it together.
          </Text>
          <Text style={{ fontSize: 12, color: C.muted, fontFamily: F.body, textAlign: 'center', marginBottom: 40 }}>Both sides of the sky. One beautiful truth.</Text>
          <TouchableOpacity style={[st.btnGold, { paddingHorizontal: 48 }]} onPress={() => onNavigate('signup')}>
            <Text style={[st.btnGoldText, { fontSize: 14 }]}>Begin Your Story</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 20, paddingVertical: 12 }} onPress={() => onNavigate('signin')}>
            <Text style={{ color: C.gold, fontSize: 13, fontFamily: F.bodyMed }}>I already have an account</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

function SignUpScreen({ onNavigate }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 90 }}>
      <StarField />
      <Text style={{ fontSize: 13, color: C.gold, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Create Account</Text>
      <Text style={{ fontSize: 30, color: C.cream, fontFamily: F.display, marginBottom: 4 }}>Let's begin</Text>
      <View style={{ width: 40, height: 2, backgroundColor: C.gold, marginTop: 8, marginBottom: 24 }} />
      <Text style={st.label}>EMAIL</Text>
      <TextInput style={st.input} placeholder="hello@example.com" placeholderTextColor={C.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Text style={st.label}>PASSWORD</Text>
      <TextInput style={st.input} placeholder="At least 8 characters" placeholderTextColor={C.muted} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={[st.btnGold, { marginTop: 28 }]} onPress={() => onNavigate('onboarding')}><Text style={st.btnGoldText}>Create My Account</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('signin')} style={{ marginTop: 24, alignSelf: 'center' }}><Text style={{ color: C.gold, fontSize: 14, fontFamily: F.body }}>Already have an account? Sign in</Text></TouchableOpacity>
    </ScrollView>
  );
}

function SignInScreen({ onNavigate }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 90 }}>
      <StarField />
      <Text style={{ fontSize: 13, color: C.gold, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Sign In</Text>
      <Text style={{ fontSize: 30, color: C.cream, fontFamily: F.display, marginBottom: 4 }}>Welcome back</Text>
      <View style={{ width: 40, height: 2, backgroundColor: C.gold, marginTop: 8, marginBottom: 24 }} />
      <Text style={st.label}>EMAIL</Text>
      <TextInput style={st.input} placeholder="hello@example.com" placeholderTextColor={C.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Text style={st.label}>PASSWORD</Text>
      <TextInput style={st.input} placeholder="Your password" placeholderTextColor={C.muted} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={[st.btnGold, { marginTop: 28 }]} onPress={() => onNavigate('onboarding')}><Text style={st.btnGoldText}>Sign In</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('signup')} style={{ marginTop: 24, alignSelf: 'center' }}><Text style={{ color: C.gold, fontSize: 14, fontFamily: F.body }}>Don't have an account? Sign up</Text></TouchableOpacity>
    </ScrollView>
  );
}

function OnboardingScreen({ onNavigate, onSaveBirthData }) {
  const [step, setStep] = useState(1);
  const [month, setMonth] = useState(''); const [day, setDay] = useState(''); const [year, setYear] = useState('');
  const [hour, setHour] = useState(''); const [minute, setMinute] = useState(''); const [ampm, setAmpm] = useState('AM');
  const [location, setLocation] = useState('');
  const dayRef = useRef(null); const yearRef = useRef(null); const minRef = useRef(null);

  const handleMonth = (v) => { setMonth(v); if (v.length === 2) dayRef.current?.focus(); };
  const handleDay = (v) => { setDay(v); if (v.length === 2) yearRef.current?.focus(); };
  const handleYear = (v) => { setYear(v); if (v.length === 4) setTimeout(() => setStep(2), 300); };
  const handleHour = (v) => { setHour(v); if (v.length === 2) minRef.current?.focus(); };
  const handleMinute = (v) => { setMinute(v); if (v.length === 2) setTimeout(() => setStep(3), 300); };

  const handleSubmit = () => {
    let h = parseInt(hour) || 12; const m = parseInt(minute) || 0;
    if (ampm === 'PM' && h !== 12) h += 12; if (ampm === 'AM' && h === 12) h = 0;
    const loc = location.trim() || 'New York';
    const parts = loc.split(',').map(s => s.trim());
    const cityName = parts[0];
    const countryCode = resolveCountryCode(parts.length > 1 ? parts[parts.length - 1] : 'US');
    onSaveBirthData({ name: 'User', year: parseInt(year) || 2000, month: parseInt(month) || 1, day: parseInt(day) || 1, hour: h, minute: m, city: cityName, country: countryCode });
    onNavigate('compiling');
  };

  const titles = ['When did the stars\nwrite your story?', 'What time did\nyou arrive?', 'Where did your\nstory begin?'];
  const subs = ['Birthday', 'Birth Time', 'Birthplace'];

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 80 }}>
      <FadeImage source={IMG.onboardingGateway} style={{ position: 'absolute', top: -40, left: 0, width: SW, height: SW * 1.4, opacity: 0.1 }} resizeMode="cover" />
      <StarField />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {[1, 2, 3].map(n => <View key={n} style={[{ width: n === step ? 28 : 10, height: 4, borderRadius: 2, backgroundColor: C.muted }, n === step && { backgroundColor: C.gold }, n < step && { backgroundColor: C.sage }]} />)}
      </View>
      <Text style={{ fontSize: 13, color: C.gold, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 8 }}>{subs[step - 1]}</Text>
      <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, lineHeight: 36, marginBottom: 28 }}>{titles[step - 1]}</Text>

      {step === 1 && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Text style={st.label}>MONTH</Text><TextInput style={st.input} placeholder="MM" placeholderTextColor={C.muted} value={month} onChangeText={handleMonth} keyboardType="number-pad" maxLength={2} returnKeyType="next" /></View>
          <View style={{ flex: 1 }}><Text style={st.label}>DAY</Text><TextInput ref={dayRef} style={st.input} placeholder="DD" placeholderTextColor={C.muted} value={day} onChangeText={handleDay} keyboardType="number-pad" maxLength={2} returnKeyType="next" /></View>
          <View style={{ flex: 1.5 }}><Text style={st.label}>YEAR</Text><TextInput ref={yearRef} style={st.input} placeholder="YYYY" placeholderTextColor={C.muted} value={year} onChangeText={handleYear} keyboardType="number-pad" maxLength={4} /></View>
        </View>
      )}
      {step === 2 && (
        <>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ flex: 1 }}><TextInput style={st.input} placeholder="HH" placeholderTextColor={C.muted} value={hour} onChangeText={handleHour} keyboardType="number-pad" maxLength={2} /></View>
            <Text style={{ color: C.gold, fontSize: 24, fontFamily: F.display }}>:</Text>
            <View style={{ flex: 1 }}><TextInput ref={minRef} style={st.input} placeholder="MM" placeholderTextColor={C.muted} value={minute} onChangeText={handleMinute} keyboardType="number-pad" maxLength={2} /></View>
            <TouchableOpacity style={[st.ampmBtn, ampm === 'AM' && st.ampmActive]} onPress={() => setAmpm('AM')}><Text style={[st.ampmText, ampm === 'AM' && st.ampmTextActive]}>AM</Text></TouchableOpacity>
            <TouchableOpacity style={[st.ampmBtn, ampm === 'PM' && st.ampmActive]} onPress={() => setAmpm('PM')}><Text style={[st.ampmText, ampm === 'PM' && st.ampmTextActive]}>PM</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => { setHour('12'); setMinute('0'); setStep(3); }} style={{ marginTop: 18 }}><Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body }}>I don't know my birth time</Text></TouchableOpacity>
        </>
      )}
      {step === 3 && (
        <>
          <Text style={st.label}>BIRTH LOCATION</Text>
          <TextInput style={st.input} placeholder="e.g. Los Angeles, USA" placeholderTextColor={C.muted} value={location} onChangeText={setLocation} autoCapitalize="words" />
          <Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 6, opacity: 0.7 }}>City, Country — or just the city name</Text>
        </>
      )}

      <TouchableOpacity style={[st.btnGold, { marginTop: 36 }]} onPress={() => step < 3 ? setStep(step + 1) : handleSubmit()}><Text style={st.btnGoldText}>{step < 3 ? 'Continue' : 'Read My Stars'}</Text></TouchableOpacity>
      {step > 1 && <TouchableOpacity onPress={() => setStep(step - 1)} style={{ marginTop: 18, alignSelf: 'center' }}><Text style={{ color: C.muted, fontSize: 14, fontFamily: F.body }}>Back</Text></TouchableOpacity>}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function CompilingScreen({ onNavigate, birthData, onChartReady }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const messages = ['gathering stardust...', 'reading the sky on the night you arrived...', 'calculating your tropical chart...', 'diving into your sidereal depths...', 'weaving your whole story...'];
  const hasFetched = useRef(false);

  useEffect(() => {
    const delays = [0, 1800, 3600, 5400, 7200];
    const timers = delays.map((d, i) => setTimeout(() => { setMsgIndex(i); opacity.setValue(0); Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }).start(); }, d));
    if (!hasFetched.current && birthData) {
      hasFetched.current = true;
      fetchChart(birthData).then(data => { if (data && data.success) onChartReady(data); setTimeout(() => onNavigate('main'), 2500); });
    } else { timers.push(setTimeout(() => onNavigate('main'), 8500)); }
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View style={[st.screen, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
      <FadeImage source={IMG.zodiacWheel} style={{ position: 'absolute', width: SW * 0.9, height: SW * 0.9, opacity: 0.06 }} resizeMode="contain" />
      <StarField />
      <GlowOrb size={350} color="rgba(212,165,116,0.06)" top={SH * 0.25} left={SW / 2 - 175} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 }}><IconStarDiamond size={12} color={C.gold} /><IconMoon size={16} color={C.gold} /><IconStarDiamond size={12} color={C.gold} /></View>
      <Animated.Text style={{ fontSize: 20, color: C.cream, textAlign: 'center', fontFamily: F.displayItalic, opacity, paddingHorizontal: 24, lineHeight: 30 }}>{messages[msgIndex]}</Animated.Text>
      <View style={{ flexDirection: 'row', marginTop: 32, gap: 10 }}>{[0, 1, 2].map(i => <PulsingDot key={i} delay={i * 400} />)}</View>
    </View>
  );
}

function PulsingDot({ delay }) {
  const pulse = useRef(new Animated.Value(0.2)).current;
  useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: 900, delay, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0.2, duration: 900, useNativeDriver: true })])).start(); }, []);
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, opacity: pulse }} />;
}

// ─── DAILY READING ───────────────────────────
function DailyReadingScreen({ planets }) {
  const [view, setView] = useState('The Surface');
  const [refreshing, setRefreshing] = useState(false);
  const [liveTransits, setLiveTransits] = useState(null);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const reading = view === 'The Surface' ? DAILY_READINGS.surface : view === 'The Depths' ? DAILY_READINGS.depths : DAILY_READINGS.wholeStory;

  // Get user's sun sign for personalized imagery
  const sunPlanet = planets ? planets.find(p => p.key === 'sun') : null;
  const tropicalSign = sunPlanet ? sunPlanet.tropical.split(' ')[0] : 'Leo';
  const siderealSign = sunPlanet ? sunPlanet.sidereal.split(' ')[0] : 'Cancer';
  const displaySign = view === 'The Surface' ? tropicalSign : view === 'The Depths' ? siderealSign : tropicalSign;
  const signImage = SIGN_IMAGES[displaySign] || SIGN_IMAGES.Leo;

  useEffect(() => { fetchTransits().then(d => { if (d) { const p = apiTransitsToDisplay(d); if (p) setLiveTransits(p); } }); }, []);
  const handleRefresh = async () => { setRefreshing(true); const d = await fetchTransits(); if (d) { const p = apiTransitsToDisplay(d); if (p) setLiveTransits(p); } setRefreshing(false); };

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} tintColor={C.gold} onRefresh={handleRefresh} />}>
      <StarField />
      <GlowOrb size={280} color="rgba(212,165,116,0.05)" top={20} right={-100} />

      <View style={{ marginTop: 60 }}>
        <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>{today}</Text>
        <Text style={{ fontSize: 32, color: C.cream, fontFamily: F.display, lineHeight: 38, marginBottom: 20 }}>Cosmic Weather</Text>
      </View>

      <ViewToggle active={view} onSelect={setView} />

      {/* Personalized sun sign constellation image */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <FadeImage source={signImage} style={{ width: SW - 80, height: SW - 80, borderRadius: 20, opacity: 0.85 }} resizeMode="cover" />
        <View style={{ position: 'absolute', bottom: 12, left: 24, right: 24, backgroundColor: 'rgba(10,14,23,0.75)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
          <Text style={{ color: C.gold, fontSize: 13, fontFamily: F.bodySemi }}>
            {view === 'Your Whole Story' ? `${tropicalSign} · ${siderealSign}` : `Sun in ${displaySign}`}
          </Text>
          <Text style={{ color: C.creamDim, fontSize: 11, fontFamily: F.body }}>
            {view === 'The Surface' ? 'Tropical · The Surface' : view === 'The Depths' ? 'Sidereal · The Depths' : 'Your Whole Story'}
          </Text>
        </View>
      </View>

      {/* Daily Reading */}
      <OrnateFrame style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: C.gold, letterSpacing: 2, fontFamily: F.bodySemi, marginBottom: 12, textTransform: 'uppercase' }}>
          {view === 'The Surface' ? 'The Surface' : view === 'The Depths' ? 'The Depths' : 'Your Whole Story'}
        </Text>
        <Text style={{ color: C.cream, fontSize: 15, lineHeight: 26, fontFamily: F.body }}>{reading}</Text>
      </OrnateFrame>

      <CelestialDivider />

      {/* Moon Forecast */}
      <GlassCard style={{ marginBottom: 20, overflow: 'hidden' }}>
        <FadeImage source={IMG.moonPhases} style={{ position: 'absolute', top: -20, right: -40, width: 200, height: 110, opacity: 0.15 }} resizeMode="cover" />
        <Text style={{ fontSize: 18, color: C.cream, fontFamily: F.displayMed, marginBottom: 4 }}>Moon Forecast</Text>
        <Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginBottom: 10 }}>Current lunar energy</Text>
        <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>
          The Moon lights up your need for creative expression today. Lean into what makes you feel alive. This is your permission to take up space.
        </Text>
      </GlassCard>

      {/* Current Transits */}
      <Text style={{ fontSize: 22, color: C.cream, fontFamily: F.display, marginBottom: 4 }}>Current Transits</Text>
      <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body, marginBottom: 16 }}>Where the planets are right now</Text>

      {(liveTransits || []).map(t => (
        <GlassCard key={t.key} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.goldDim, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <PlanetIcon planet={t.key} size={22} color={C.gold} />
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodyMed }}>{t.planet} in {t.sign}</Text>
                {t.retrograde && <View style={{ backgroundColor: 'rgba(212,160,160,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}><Text style={{ color: C.blush, fontSize: 10, fontFamily: F.bodySemi }}>Rx</Text></View>}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <ZodiacIcon sign={t.sign} size={12} color={C.gold} />
                <Text style={{ color: C.gold, fontSize: 12, fontFamily: F.body }}>{t.degree}°</Text>
                <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body }}>· {t.element} · {t.quality}</Text>
              </View>
            </View>
          </View>
          {/* Sign-specific transit interpretation */}
          <Text style={{ color: C.cream, fontSize: 14, lineHeight: 22, fontFamily: F.body, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border }}>{t.meaning}</Text>
        </GlassCard>
      ))}
      {!liveTransits && <GlassCard><Text style={{ color: C.muted, fontSize: 14, fontFamily: F.body, textAlign: 'center' }}>Pull down to load live transits</Text></GlassCard>}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ─── CHART ───────────────────────────────────
function ChartScreen({ planets }) {
  const [view, setView] = useState('The Surface');
  const [expanded, setExpanded] = useState(null);
  const displayPlanets = planets || FALLBACK_PLANETS;

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
      <StarField />
      <GlowOrb size={300} color="rgba(127,160,138,0.04)" top={40} left={SW / 2 - 150} />

      <View style={{ marginTop: 60 }}>
        <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Your Chart</Text>
        <Text style={{ fontSize: 32, color: C.cream, fontFamily: F.display, lineHeight: 38, marginBottom: 20 }}>Birth Chart</Text>
      </View>

      <ViewToggle active={view} onSelect={setView} />

      {view !== 'Your Whole Story' ? (
        <ConstellationChart planets={displayPlanets} view={view} />
      ) : (
        <View>
          <FadeImage source={IMG.chartHero} style={{ width: SW - 64, height: SW - 64, opacity: 0.25, alignSelf: 'center', marginBottom: 16, borderRadius: 20 }} resizeMode="contain" />
          <OrnateFrame style={{ marginBottom: 16 }}><Text style={{ color: C.cream, fontSize: 15, lineHeight: 26, fontFamily: F.body }}>Your Whole Story combines both charts — what the world sees on The Surface and what's really running on The Depths. Together, they reveal the complete code of who you are.</Text></OrnateFrame>
        </View>
      )}

      <CelestialDivider />

      <Text style={{ fontSize: 22, color: C.cream, fontFamily: F.display, marginBottom: 4 }}>Planet Placements</Text>
      <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body, marginBottom: 16 }}>
        {view === 'The Surface' ? 'Tropical · Western astrology' : view === 'The Depths' ? 'Sidereal · Vedic astrology' : 'Both perspectives side by side'}
      </Text>

      {displayPlanets.map(p => {
        const isOpen = expanded === p.name;
        const data = view === 'The Surface' ? p.tropicalData : p.siderealData;
        return (
          <GlassCard key={p.name} onPress={() => setExpanded(isOpen ? null : p.name)} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.goldDim, justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: C.border }}>
                <PlanetIcon planet={p.key} size={22} color={C.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.cream, fontSize: 16, fontFamily: F.bodyMed }}>{p.name}</Text>
                {view === 'Your Whole Story' ? (
                  <View><Text style={{ color: C.gold, fontSize: 12, fontFamily: F.body, marginTop: 2 }}>Surface: {p.tropical}</Text><Text style={{ color: C.sage, fontSize: 12, fontFamily: F.body, marginTop: 1 }}>Depths: {p.sidereal}</Text></View>
                ) : (
                  <Text style={{ color: C.gold, fontSize: 13, fontFamily: F.body, marginTop: 2 }}>{view === 'The Surface' ? p.tropical : p.sidereal}</Text>
                )}
              </View>
              <Text style={{ color: C.muted, fontSize: 16 }}>{isOpen ? '▾' : '›'}</Text>
            </View>
            {isOpen && (() => {
              const currentSign = view === 'The Surface' ? p.tropical : (view === 'The Depths' ? p.sidereal : p.tropical);
              const houseInfo = data && data.house ? HOUSE_LABELS[data.house] : null;
              const signInsight = getPlacementInsight(p.key, currentSign);
              return (
              <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border }}>
                {/* Prominent House Display */}
                {houseInfo && (
                  <View style={{ backgroundColor: 'rgba(212,165,116,0.08)', borderWidth: 1, borderColor: 'rgba(212,165,116,0.2)', borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(212,165,116,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: 'rgba(212,165,116,0.3)' }}>
                      <Text style={{ color: C.gold, fontSize: 18, fontFamily: F.displayBold }}>{data.house}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodySemi }}>{houseInfo.name}</Text>
                      <Text style={{ color: C.cream, fontSize: 12, fontFamily: F.body, marginTop: 2, opacity: 0.8 }}>{houseInfo.area}</Text>
                    </View>
                  </View>
                )}
                {/* Element / Quality / Retrograde tags */}
                {data && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <View style={st.tagPill}><Text style={st.tagText}>{data.element}</Text></View>
                    <View style={st.tagPill}><Text style={st.tagText}>{data.quality}</Text></View>
                    {data.retrograde && <View style={[st.tagPill, { backgroundColor: 'rgba(212,160,160,0.12)' }]}><Text style={[st.tagText, { color: C.blush }]}>Retrograde</Text></View>}
                  </View>
                )}
                {/* Keywords */}
                {p.meaning && p.meaning.keywords && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {p.meaning.keywords.map(kw => <View key={kw} style={{ backgroundColor: 'rgba(127,160,138,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}><Text style={{ color: C.sageLight, fontSize: 11, fontFamily: F.bodySemi }}>{kw}</Text></View>)}
                  </View>
                )}
                {/* Sign-specific interpretation */}
                <Text style={{ color: C.cream, fontSize: 14, lineHeight: 23, fontFamily: F.body }}>
                  {signInsight || `Your ${p.name.toLowerCase()} placement reveals how this energy uniquely shapes your life.`}
                </Text>
              </View>
              );
            })()}
          </GlassCard>
        );
      })}
    </ScrollView>
  );
}

// ─── COURSES ─────────────────────────────────
function CoursesScreen() {
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  // Journal state
  const [showJournal, setShowJournal] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalText, setJournalText] = useState('');
  const [activePrompt, setActivePrompt] = useState(getDailyPrompt());
  const [journalView, setJournalView] = useState('write'); // 'write' | 'history'
  const [editingEntryId, setEditingEntryId] = useState(null);

  const markComplete = (courseId, lessonIdx) => {
    setCompletedLessons(prev => ({ ...prev, [`${courseId}_${lessonIdx}`]: true }));
  };

  const getCourseProgress = (course) => {
    const total = course.lessons.length;
    const done = course.lessons.filter((_, i) => completedLessons[`${course.id}_${i}`]).length;
    return { done, total, pct: total > 0 ? done / total : 0 };
  };

  // ─── LESSON READER VIEW ───
  if (activeLesson !== null && activeCourse) {
    const lesson = activeCourse.lessons[activeLesson];
    const isComplete = completedLessons[`${activeCourse.id}_${activeLesson}`];
    const hasNext = activeLesson < activeCourse.lessons.length - 1;
    const hasPrev = activeLesson > 0;

    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        <StarField />
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setActiveLesson(null)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back to course</Text>
          </TouchableOpacity>

          <Text style={{ color: C.muted, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>
            Lesson {activeLesson + 1} of {activeCourse.lessons.length}
          </Text>
          <Text style={{ fontSize: 26, color: C.cream, fontFamily: F.display, lineHeight: 32, marginBottom: 20 }}>{lesson.title}</Text>

          {/* Progress dots */}
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 24 }}>
            {activeCourse.lessons.map((_, i) => (
              <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i === activeLesson ? C.gold : completedLessons[`${activeCourse.id}_${i}`] ? C.sage : C.border }} />
            ))}
          </View>
        </View>

        {/* Lesson body */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: C.cream, fontSize: 15, lineHeight: 26, fontFamily: F.body }}>{lesson.body}</Text>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          {!isComplete && (
            <TouchableOpacity style={st.btnGold} onPress={() => {
              markComplete(activeCourse.id, activeLesson);
              if (hasNext) setTimeout(() => setActiveLesson(activeLesson + 1), 400);
            }}>
              <Text style={st.btnGoldText}>{hasNext ? 'Complete & Continue' : 'Complete Lesson'}</Text>
            </TouchableOpacity>
          )}
          {isComplete && hasNext && (
            <TouchableOpacity style={st.btnGold} onPress={() => setActiveLesson(activeLesson + 1)}>
              <Text style={st.btnGoldText}>Next Lesson</Text>
            </TouchableOpacity>
          )}
          {isComplete && !hasNext && (
            <OrnateFrame style={{ alignItems: 'center' }}>
              <IconStarDiamond size={24} color={C.gold} />
              <Text style={{ color: C.cream, fontSize: 18, fontFamily: F.display, marginTop: 12 }}>Course Complete</Text>
              <Text style={{ color: C.creamDim, fontSize: 13, fontFamily: F.body, textAlign: 'center', marginTop: 6 }}>You finished {activeCourse.title}. Your cosmic literacy just leveled up.</Text>
              <TouchableOpacity style={[st.btnOutline, { marginTop: 16 }]} onPress={() => { setActiveLesson(null); setActiveCourse(null); }}>
                <Text style={st.btnOutlineText}>Back to Library</Text>
              </TouchableOpacity>
            </OrnateFrame>
          )}

          {/* Nav arrows */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            {hasPrev ? (
              <TouchableOpacity onPress={() => setActiveLesson(activeLesson - 1)} style={{ paddingVertical: 12 }}>
                <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.bodyMed }}>{'<'} Previous</Text>
              </TouchableOpacity>
            ) : <View />}
            {hasNext ? (
              <TouchableOpacity onPress={() => setActiveLesson(activeLesson + 1)} style={{ paddingVertical: 12 }}>
                <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.bodyMed }}>Next {'>'}</Text>
              </TouchableOpacity>
            ) : <View />}
          </View>
        </View>
      </ScrollView>
    );
  }

  // ─── COURSE DETAIL VIEW ───
  if (activeCourse) {
    const progress = getCourseProgress(activeCourse);
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        <StarField />
        <GlowOrb size={250} color="rgba(127,160,138,0.04)" top={30} right={-80} />

        <View style={{ paddingHorizontal: 24, paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setActiveCourse(null)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Cosmic Library</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={[st.tagPill, activeCourse.tag === 'Popular' && { backgroundColor: 'rgba(212,165,116,0.2)' }, activeCourse.tag === 'New' && { backgroundColor: 'rgba(127,160,138,0.2)' }]}>
              <Text style={[st.tagText, activeCourse.tag === 'Popular' && { color: C.gold }, activeCourse.tag === 'New' && { color: C.sage }]}>{activeCourse.tag}</Text>
            </View>
            <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body }}>{activeCourse.duration} · {activeCourse.lessons.length} lessons</Text>
          </View>

          <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, lineHeight: 34, marginBottom: 12 }}>{activeCourse.title}</Text>
          <Text style={{ color: C.creamDim, fontSize: 15, lineHeight: 24, fontFamily: F.body, marginBottom: 20 }}>{activeCourse.intro}</Text>

          {/* Progress bar */}
          {progress.done > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.bodySemi }}>{progress.done} of {progress.total} complete</Text>
                <Text style={{ color: C.gold, fontSize: 11, fontFamily: F.bodySemi }}>{Math.round(progress.pct * 100)}%</Text>
              </View>
              <View style={{ height: 4, backgroundColor: C.border, borderRadius: 2 }}>
                <View style={{ height: 4, backgroundColor: C.gold, borderRadius: 2, width: `${progress.pct * 100}%` }} />
              </View>
            </View>
          )}

          <CelestialDivider style={{ marginVertical: 12 }} />

          <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 14 }}>Lessons</Text>

          {activeCourse.lessons.map((lesson, i) => {
            const isDone = completedLessons[`${activeCourse.id}_${i}`];
            return (
              <GlassCard key={i} onPress={() => setActiveLesson(i)} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isDone ? C.sage : C.goldDim, justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: isDone ? C.sage : C.border }}>
                    {isDone ? (
                      <Text style={{ color: '#fff', fontSize: 14, fontFamily: F.bodySemi }}>{'✓'}</Text>
                    ) : (
                      <Text style={{ color: C.gold, fontSize: 12, fontFamily: F.bodySemi }}>{i + 1}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isDone ? C.creamDim : C.cream, fontSize: 14, fontFamily: F.bodyMed }}>{lesson.title}</Text>
                  </View>
                  <Text style={{ color: C.muted, fontSize: 14 }}>{'>'}</Text>
                </View>
              </GlassCard>
            );
          })}

          {/* Start/Continue button */}
          <TouchableOpacity style={[st.btnGold, { marginTop: 16 }]} onPress={() => {
            const firstIncomplete = activeCourse.lessons.findIndex((_, i) => !completedLessons[`${activeCourse.id}_${i}`]);
            setActiveLesson(firstIncomplete >= 0 ? firstIncomplete : 0);
          }}>
            <Text style={st.btnGoldText}>{progress.done > 0 ? 'Continue Course' : 'Start Course'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ─── JOURNAL VIEW ───
  if (showJournal) {
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const saveEntry = () => {
      if (!journalText.trim()) return;
      if (editingEntryId !== null) {
        setJournalEntries(prev => prev.map(e => e.id === editingEntryId ? { ...e, text: journalText.trim() } : e));
        setEditingEntryId(null);
      } else {
        const entry = { id: Date.now(), date: new Date().toISOString(), prompt: activePrompt, text: journalText.trim() };
        setJournalEntries(prev => [entry, ...prev]);
      }
      setJournalText('');
      setJournalView('history');
    };
    const deleteEntry = (id) => {
      Alert.alert('Delete Entry', 'Remove this journal entry?', [
        { text: 'Cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setJournalEntries(prev => prev.filter(e => e.id !== id)) }
      ]);
    };
    const shufflePrompt = () => {
      const others = JOURNAL_PROMPTS.filter(p => p.id !== activePrompt.id);
      setActivePrompt(others[Math.floor(Math.random() * others.length)]);
    };

    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        <StarField />
        <GlowOrb size={280} color="rgba(212,165,116,0.04)" top={30} right={-100} />

        <View style={{ paddingHorizontal: 24, paddingTop: 56 }}>
          <TouchableOpacity onPress={() => { setShowJournal(false); setEditingEntryId(null); setJournalText(''); }} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back to Library</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <IconMoon size={18} color={C.gold} />
            <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase' }}>Cosmic Journal</Text>
          </View>
          <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, lineHeight: 34, marginBottom: 4 }}>{todayStr}</Text>
          <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.displayItalic, marginBottom: 20 }}>Your private space for celestial reflection</Text>

          {/* Write / History toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: C.bgCard, borderRadius: 14, padding: 3, marginBottom: 20, borderWidth: 1, borderColor: C.borderLight }}>
            {['write', 'history'].map(v => (
              <TouchableOpacity key={v} style={[{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' }, journalView === v && { backgroundColor: C.gold }]} onPress={() => { setJournalView(v); if (v === 'write') setEditingEntryId(null); }}>
                <Text style={[{ fontSize: 13, fontFamily: F.bodySemi, color: C.muted }, journalView === v && { color: C.bg }]}>{v === 'write' ? 'Write' : `Entries (${journalEntries.length})`}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {journalView === 'write' && (
            <>
              {/* Today's prompt card */}
              <OrnateFrame style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {activePrompt.tags.map(t => (
                      <View key={t} style={{ backgroundColor: 'rgba(127,160,138,0.12)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
                        <Text style={{ color: C.sageLight, fontSize: 10, fontFamily: F.bodySemi }}>{t}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity onPress={shufflePrompt} style={{ paddingLeft: 12 }}>
                    <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.bodySemi }}>Shuffle</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: C.cream, fontSize: 17, lineHeight: 26, fontFamily: F.displayItalic }}>{activePrompt.prompt}</Text>
                <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body, marginTop: 8 }}>Theme: {activePrompt.theme}</Text>
              </OrnateFrame>

              {/* Writing area */}
              <TextInput
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: C.glassBorder,
                  paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18, color: C.cream, fontSize: 15, fontFamily: F.body,
                  minHeight: 180, textAlignVertical: 'top', lineHeight: 24,
                }}
                placeholder="Let your thoughts flow..."
                placeholderTextColor={C.muted}
                value={journalText}
                onChangeText={setJournalText}
                multiline
                numberOfLines={8}
              />
              <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body, textAlign: 'right', marginTop: 6 }}>{journalText.length} characters</Text>

              <TouchableOpacity style={[st.btnGold, { marginTop: 16, opacity: journalText.trim() ? 1 : 0.4 }]} onPress={saveEntry} disabled={!journalText.trim()}>
                <Text style={st.btnGoldText}>{editingEntryId !== null ? 'Update Entry' : 'Save Entry'}</Text>
              </TouchableOpacity>
              {editingEntryId !== null && (
                <TouchableOpacity style={{ marginTop: 12, alignSelf: 'center' }} onPress={() => { setEditingEntryId(null); setJournalText(''); }}>
                  <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body }}>Cancel Edit</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {journalView === 'history' && (
            <>
              {journalEntries.length === 0 ? (
                <GlassCard style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <IconStarDiamond size={28} color={C.gold} />
                  <Text style={{ color: C.cream, fontSize: 18, fontFamily: F.display, marginTop: 14 }}>No entries yet</Text>
                  <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>Your reflections will appear here.{'\n'}Start writing to capture your cosmic journey.</Text>
                  <TouchableOpacity style={[st.btnOutline, { marginTop: 20 }]} onPress={() => setJournalView('write')}>
                    <Text style={st.btnOutlineText}>Write First Entry</Text>
                  </TouchableOpacity>
                </GlassCard>
              ) : (
                journalEntries.map(entry => {
                  const entryDate = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                  const entryTime = new Date(entry.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                  return (
                    <GlassCard key={entry.id} style={{ marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <View>
                          <Text style={{ color: C.cream, fontSize: 13, fontFamily: F.bodySemi }}>{entryDate}</Text>
                          <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body }}>{entryTime} · {entry.prompt.theme}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                          <TouchableOpacity onPress={() => { setEditingEntryId(entry.id); setJournalText(entry.text); setJournalView('write'); setActivePrompt(entry.prompt); }}>
                            <Text style={{ color: C.gold, fontSize: 12, fontFamily: F.bodySemi }}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
                            <Text style={{ color: C.blush, fontSize: 12, fontFamily: F.bodySemi }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={{ color: C.creamDim, fontSize: 13, fontFamily: F.displayItalic, marginBottom: 8, lineHeight: 20 }}>"{entry.prompt.prompt}"</Text>
                      <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, paddingTop: 10 }}>
                        <Text style={{ color: C.cream, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>{entry.text}</Text>
                      </View>
                    </GlassCard>
                  );
                })
              )}
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  // ─── LIBRARY OVERVIEW ───
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
      <StarField />

      {/* Learn hero image */}
      <FadeImage source={IMG.learnHero} style={{ width: SW - 48, height: (SW - 48) * 0.65, borderRadius: 20, alignSelf: 'center', marginTop: 50, marginBottom: 16, opacity: 0.7 }} resizeMode="cover" />

      <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Learn</Text>
      <Text style={{ fontSize: 32, color: C.cream, fontFamily: F.display, lineHeight: 38, marginBottom: 4 }}>Cosmic Library</Text>
      <Text style={{ color: C.muted, fontSize: 14, fontFamily: F.displayItalic, marginBottom: 24 }}>Deepen your celestial literacy</Text>

      {COURSES.map(c => {
        const progress = getCourseProgress(c);
        return (
          <GlassCard key={c.id} onPress={() => setActiveCourse(c)} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ color: C.cream, fontSize: 16, fontFamily: F.bodyMed, flex: 1 }}>{c.title}</Text>
                  <View style={[st.tagPill, c.tag === 'Popular' && { backgroundColor: 'rgba(212,165,116,0.2)' }, c.tag === 'New' && { backgroundColor: 'rgba(127,160,138,0.2)' }]}>
                    <Text style={[st.tagText, c.tag === 'Popular' && { color: C.gold }, c.tag === 'New' && { color: C.sage }]}>{c.tag}</Text>
                  </View>
                </View>
                <Text style={{ color: C.muted, fontSize: 13, lineHeight: 19, fontFamily: F.body }}>{c.desc}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body }}>{c.lessons.length} lessons · {c.duration}</Text>
                  {progress.done > 0 && <Text style={{ color: C.sage, fontSize: 11, fontFamily: F.bodySemi }}>{Math.round(progress.pct * 100)}% done</Text>}
                </View>
                {progress.done > 0 && (
                  <View style={{ height: 3, backgroundColor: C.border, borderRadius: 2, marginTop: 8 }}>
                    <View style={{ height: 3, backgroundColor: C.gold, borderRadius: 2, width: `${progress.pct * 100}%` }} />
                  </View>
                )}
              </View>
            </View>
          </GlassCard>
        );
      })}

      <CelestialDivider />

      {/* Journal Entry Point */}
      <OrnateFrame>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <IconMoon size={20} color={C.gold} />
          <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase' }}>Cosmic Journal</Text>
        </View>
        <Text style={{ fontSize: 20, color: C.cream, fontFamily: F.display, marginBottom: 8 }}>Reflection Prompts</Text>
        <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body, marginBottom: 4 }}>Daily prompts inspired by your chart and the current sky.</Text>
        <Text style={{ color: C.muted, fontSize: 12, fontFamily: F.displayItalic, marginBottom: 16 }}>Today's theme: {getDailyPrompt().theme}</Text>
        <TouchableOpacity style={st.btnGold} onPress={() => setShowJournal(true)}><Text style={st.btnGoldText}>Open Journal</Text></TouchableOpacity>
        {journalEntries.length > 0 && (
          <Text style={{ color: C.sage, fontSize: 12, fontFamily: F.bodySemi, textAlign: 'center', marginTop: 10 }}>{journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'} saved</Text>
        )}
      </OrnateFrame>
    </ScrollView>
  );
}

// ─── PROFILE ─────────────────────────────────
function SettingsToggle({ label, description, value, onToggle }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border }}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text style={{ color: C.cream, fontSize: 14, fontFamily: F.bodyMed }}>{label}</Text>
        {description && <Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 2 }}>{description}</Text>}
      </View>
      <TouchableOpacity onPress={onToggle} style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: value ? C.gold : C.bgCard, borderWidth: 1, borderColor: value ? C.gold : C.border, justifyContent: 'center', paddingHorizontal: 2 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: value ? C.bg : C.muted, alignSelf: value ? 'flex-end' : 'flex-start' }} />
      </TouchableOpacity>
    </View>
  );
}

function ProfileScreen({ onNavigate, birthData }) {
  const [settingsView, setSettingsView] = useState(null);
  const [notifDaily, setNotifDaily] = useState(true);
  const [notifTransits, setNotifTransits] = useState(true);
  const [notifNewMoon, setNotifNewMoon] = useState(true);
  const [notifFullMoon, setNotifFullMoon] = useState(true);
  const [notifRetro, setNotifRetro] = useState(false);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showDegrees, setShowDegrees] = useState(true);
  const [defaultView, setDefaultView] = useState('The Surface');

  const dd = birthData ? new Date(birthData.year, birthData.month - 1, birthData.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';
  const dt = birthData ? `${birthData.hour > 12 ? birthData.hour - 12 : birthData.hour || 12}:${String(birthData.minute).padStart(2, '0')} ${birthData.hour >= 12 ? 'PM' : 'AM'}` : 'Not set';
  const dp = birthData ? `${birthData.city}${birthData.country && birthData.country !== birthData.city ? ', ' + birthData.country : ''}` : 'Not set';

  // ─── NOTIFICATIONS SETTINGS ───
  if (settingsView === 'notifications') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <StarField />
        <View style={{ paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setSettingsView(null)} style={{ marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Settings</Text>
          <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, marginBottom: 24 }}>Notifications</Text>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 4 }}>Daily</Text>
            <SettingsToggle label="Daily Reading" description="Your personalized cosmic weather each morning" value={notifDaily} onToggle={() => setNotifDaily(!notifDaily)} />
            <SettingsToggle label="Transit Alerts" description="When major planets change signs or go retrograde" value={notifTransits} onToggle={() => setNotifTransits(!notifTransits)} />
          </GlassCard>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 4 }}>Lunar</Text>
            <SettingsToggle label="New Moon Reminders" description="Intention-setting prompts at each new moon" value={notifNewMoon} onToggle={() => setNotifNewMoon(!notifNewMoon)} />
            <SettingsToggle label="Full Moon Reminders" description="Release rituals and reflection at each full moon" value={notifFullMoon} onToggle={() => setNotifFullMoon(!notifFullMoon)} />
            <SettingsToggle label="Retrograde Alerts" description="Heads up when planets go retrograde" value={notifRetro} onToggle={() => setNotifRetro(!notifRetro)} />
          </GlassCard>

          <GlassCard>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 4 }}>Other</Text>
            <SettingsToggle label="New Content & Features" description="Updates about new courses, features, and celestial events" value={notifMarketing} onToggle={() => setNotifMarketing(!notifMarketing)} />
          </GlassCard>
        </View>
      </ScrollView>
    );
  }

  // ─── APPEARANCE SETTINGS ───
  if (settingsView === 'appearance') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <StarField />
        <View style={{ paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setSettingsView(null)} style={{ marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Settings</Text>
          <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, marginBottom: 24 }}>Appearance</Text>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 4 }}>Theme</Text>
            <SettingsToggle label="Dark Mode" description="Midnight sky (recommended for stargazing)" value={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </GlassCard>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 4 }}>Chart Display</Text>
            <SettingsToggle label="Show Degrees" description="Display exact degree positions in chart wheel" value={showDegrees} onToggle={() => setShowDegrees(!showDegrees)} />
          </GlassCard>

          <GlassCard>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 12 }}>Default View</Text>
            {['The Surface', 'The Depths', 'Your Whole Story'].map(v => (
              <TouchableOpacity key={v} onPress={() => setDefaultView(v)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: defaultView === v ? C.gold : C.muted, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  {defaultView === v && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.gold }} />}
                </View>
                <Text style={{ color: defaultView === v ? C.cream : C.muted, fontSize: 14, fontFamily: F.bodyMed }}>{v}</Text>
              </TouchableOpacity>
            ))}
          </GlassCard>
        </View>
      </ScrollView>
    );
  }

  // ─── ABOUT SCREEN ───
  if (settingsView === 'about') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <StarField />
        <View style={{ paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setSettingsView(null)} style={{ marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <FadeImage source={IMG.profileHero} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 14, opacity: 0.8 }} resizeMode="cover" />
            <Text style={{ fontSize: 32, color: C.cream, fontFamily: F.display, marginBottom: 4 }}>FAIRY CODE</Text>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.displayItalic, marginBottom: 2 }}>Your stars wrote a story.</Text>
            <Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body }}>Version 1.0.0</Text>
          </View>
          <OrnateFrame style={{ marginBottom: 20 }}>
            <Text style={{ color: C.cream, fontSize: 15, lineHeight: 24, fontFamily: F.body }}>FAIRY CODE is the first astrology app to combine tropical and sidereal astrology into one unified experience called "Your Whole Story."</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body, marginTop: 12 }}>Most apps show you one chart. We show you both — because you're more than just your Sun sign. The Surface reveals who the world sees. The Depths reveal who you really are. Together, they tell the complete truth.</Text>
          </OrnateFrame>
          <GlassCard style={{ marginBottom: 12 }}>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 12 }}>Built With</Text>
            {[['Chart Engine', 'Swiss Ephemeris via Kerykeion'], ['Zodiac Systems', 'Tropical + Sidereal (Lahiri)'], ['Data Source', 'Real-time planetary positions'], ['Design', 'DALL·E celestial art + custom SVG']].map(([l, v]) => (
              <View key={l} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body }}>{l}</Text>
                <Text style={{ color: C.cream, fontSize: 12, fontFamily: F.bodyMed, flex: 1, textAlign: 'right' }}>{v}</Text>
              </View>
            ))}
          </GlassCard>
          <GlassCard>
            <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 12 }}>Connect</Text>
            {[['TikTok', '@thecodefairy'], ['Instagram', '@thecodefairy'], ['Support', 'hello@fairycode.app']].map(([l, v]) => (
              <View key={l} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body }}>{l}</Text>
                <Text style={{ color: C.gold, fontSize: 13, fontFamily: F.bodyMed }}>{v}</Text>
              </View>
            ))}
          </GlassCard>
          <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body, textAlign: 'center', marginTop: 24, lineHeight: 18 }}>Made with stardust and strong opinions about astrology.</Text>
        </View>
      </ScrollView>
    );
  }

  // ─── PRIVACY POLICY ───
  if (settingsView === 'privacy') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <StarField />
        <View style={{ paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setSettingsView(null)} style={{ marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Legal</Text>
          <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, marginBottom: 24 }}>Privacy Policy</Text>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>Your Data, Your Stars</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>FAIRY CODE collects only the birth data you provide (date, time, and location) to calculate your astrological charts. We use this data solely to deliver your personalized readings and chart calculations.</Text>
          </GlassCard>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>What We Collect</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>{'•'} Email address (for account creation){'\n'}{'•'} Birth date, time, and location (for charts){'\n'}{'•'} Course progress and journal entries{'\n'}{'•'} Subscription status (for access management)</Text>
          </GlassCard>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>What We Never Do</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>{'•'} Sell your personal data to third parties{'\n'}{'•'} Share your birth data with advertisers{'\n'}{'•'} Read your private journal entries{'\n'}{'•'} Track your location beyond what you provide</Text>
          </GlassCard>
          <GlassCard>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>Data Deletion</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>You can delete your account and all associated data at any time. We honor all deletion requests within 30 days.</Text>
          </GlassCard>
          <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body, textAlign: 'center', marginTop: 20 }}>Last updated: March 2026</Text>
        </View>
      </ScrollView>
    );
  }

  // ─── TERMS OF SERVICE ───
  if (settingsView === 'terms') {
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <StarField />
        <View style={{ paddingTop: 56 }}>
          <TouchableOpacity onPress={() => setSettingsView(null)} style={{ marginBottom: 20 }}>
            <Text style={{ color: C.gold, fontSize: 14, fontFamily: F.bodyMed }}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontFamily: F.bodySemi, textTransform: 'uppercase', marginBottom: 6 }}>Legal</Text>
          <Text style={{ fontSize: 28, color: C.cream, fontFamily: F.display, marginBottom: 24 }}>Terms of Service</Text>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>Welcome to FAIRY CODE</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>By using FAIRY CODE, you agree to these terms. We provide astrological content for entertainment and self-reflection purposes. Our readings should not replace professional advice for medical, legal, financial, or psychological matters.</Text>
          </GlassCard>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>Subscriptions</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>FAIRY CODE offers a 7-day free trial followed by paid subscription plans. Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period.</Text>
          </GlassCard>
          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>Your Content</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>Journal entries and personal reflections you create within the app belong to you. We do not claim ownership of your content.</Text>
          </GlassCard>
          <GlassCard>
            <Text style={{ color: C.cream, fontSize: 15, fontFamily: F.bodySemi, marginBottom: 8 }}>Intellectual Property</Text>
            <Text style={{ color: C.creamDim, fontSize: 14, lineHeight: 22, fontFamily: F.body }}>All course content, readings, artwork, and design elements are protected by copyright. The "Surface & Depths" framework and "Your Whole Story" methodology are original to FAIRY CODE.</Text>
          </GlassCard>
          <Text style={{ color: C.muted, fontSize: 11, fontFamily: F.body, textAlign: 'center', marginTop: 20 }}>Last updated: March 2026</Text>
        </View>
      </ScrollView>
    );
  }

  // ─── MAIN PROFILE VIEW ───
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
      <StarField />

      {/* Profile hero image */}
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <FadeImage source={IMG.profileHero} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 14, opacity: 0.8 }} resizeMode="cover" />
        <Text style={{ color: C.cream, fontSize: 22, fontFamily: F.display }}>FAIRY CODE</Text>
        <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body, marginTop: 4, marginBottom: 24 }}>7-day free trial</Text>
      </View>

      <GlassCard style={{ marginBottom: 14 }}>
        <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontFamily: F.bodySemi, textTransform: 'uppercase' }}>Your Birth Data</Text>
        {[['Born', dd], ['Time', dt], ['Place', dp]].map(([l, v]) => (
          <View key={l} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: C.muted, fontSize: 13, fontFamily: F.body }}>{l}</Text>
            <Text style={{ color: C.cream, fontSize: 13, fontFamily: F.bodyMed }}>{v}</Text>
          </View>
        ))}
        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => onNavigate('onboarding')}><Text style={{ color: C.gold, fontSize: 13, fontFamily: F.bodyMed }}>Edit Birth Data</Text></TouchableOpacity>
      </GlassCard>

      <GlassCard style={{ marginBottom: 14 }}>
        <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontFamily: F.bodySemi, textTransform: 'uppercase' }}>Subscription</Text>
        <Text style={{ color: C.cream, fontSize: 14, fontFamily: F.body, marginBottom: 14 }}>7-day free trial — 5 days remaining</Text>
        <TouchableOpacity style={st.btnGold} onPress={() => Alert.alert('Subscription', 'Premium plans coming soon!')}><Text style={st.btnGoldText}>View Plans</Text></TouchableOpacity>
      </GlassCard>

      <CelestialDivider />

      <Text style={{ color: C.gold, fontSize: 11, letterSpacing: 2, marginBottom: 14, fontFamily: F.bodySemi, textTransform: 'uppercase' }}>Settings</Text>

      <GlassCard onPress={() => setSettingsView('notifications')} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.goldDim, justifyContent: 'center', alignItems: 'center' }}><IconToday size={16} color={C.gold} /></View>
            <View><Text style={{ color: C.cream, fontSize: 14, fontFamily: F.bodyMed }}>Notifications</Text><Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 1 }}>Daily readings & transit alerts</Text></View>
          </View>
          <Text style={{ color: C.muted, fontSize: 14 }}>{'\u203A'}</Text>
        </View>
      </GlassCard>

      <GlassCard onPress={() => setSettingsView('appearance')} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.goldDim, justifyContent: 'center', alignItems: 'center' }}><IconChart size={16} color={C.gold} /></View>
            <View><Text style={{ color: C.cream, fontSize: 14, fontFamily: F.bodyMed }}>Appearance</Text><Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 1 }}>Theme & chart display preferences</Text></View>
          </View>
          <Text style={{ color: C.muted, fontSize: 14 }}>{'\u203A'}</Text>
        </View>
      </GlassCard>

      <GlassCard onPress={() => setSettingsView('privacy')} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(127,160,138,0.12)', justifyContent: 'center', alignItems: 'center' }}><IconProfile size={16} color={C.sage} /></View>
            <View><Text style={{ color: C.cream, fontSize: 14, fontFamily: F.bodyMed }}>Privacy Policy</Text><Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 1 }}>How we handle your data</Text></View>
          </View>
          <Text style={{ color: C.muted, fontSize: 14 }}>{'\u203A'}</Text>
        </View>
      </GlassCard>

      <GlassCard onPress={() => setSettingsView('terms')} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(127,160,138,0.12)', justifyContent: 'center', alignItems: 'center' }}><IconLearn size={16} color={C.sage} /></View>
            <View><Text style={{ color: C.cream, fontSize: 14, fontFamily: F.bodyMed }}>Terms of Service</Text><Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 1 }}>Usage agreement</Text></View>
          </View>
          <Text style={{ color: C.muted, fontSize: 14 }}>{'\u203A'}</Text>
        </View>
      </GlassCard>

      <GlassCard onPress={() => setSettingsView('about')} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.goldDim, justifyContent: 'center', alignItems: 'center' }}><IconStarDiamond size={14} color={C.gold} /></View>
            <View><Text style={{ color: C.cream, fontSize: 14, fontFamily: F.bodyMed }}>About FAIRY CODE</Text><Text style={{ color: C.muted, fontSize: 12, fontFamily: F.body, marginTop: 1 }}>Version 1.0.0</Text></View>
          </View>
          <Text style={{ color: C.muted, fontSize: 14 }}>{'\u203A'}</Text>
        </View>
      </GlassCard>

      <TouchableOpacity style={[st.btnOutline, { marginTop: 24 }]} onPress={() => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Sign Out', style: 'destructive', onPress: () => onNavigate('welcome') }])}><Text style={st.btnOutlineText}>Sign Out</Text></TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center', paddingVertical: 8 }} onPress={() => Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])}>
        <Text style={{ color: C.error, fontSize: 13, fontFamily: F.body }}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════
// TAB BAR
// ═══════════════════════════════════════════════
function TabBar({ active, onSelect }) {
  const tabs = [
    { id: 'daily', label: 'Today', Icon: IconToday },
    { id: 'chart', label: 'Chart', Icon: IconChart },
    { id: 'courses', label: 'Learn', Icon: IconLearn },
    { id: 'profile', label: 'You', Icon: IconProfile },
  ];
  return (
    <View style={{ flexDirection: 'row', backgroundColor: C.bgElevated, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, paddingTop: 10, paddingBottom: 30 }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <TouchableOpacity key={t.id} style={{ flex: 1, alignItems: 'center', gap: 4 }} onPress={() => onSelect(t.id)}>
            <t.Icon size={22} color={isActive ? C.gold : C.muted} />
            <Text style={{ fontSize: 10, color: isActive ? C.gold : C.muted, fontFamily: F.bodySemi, letterSpacing: 0.5 }}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [tab, setTab] = useState('daily');
  const [birthData, setBirthData] = useState(null);
  const [planets, setPlanets] = useState(null);

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, BodoniModa_400Regular, BodoniModa_500Medium, BodoniModa_600SemiBold, BodoniModa_700Bold, BodoniModa_400Regular_Italic });

  const navigate = useCallback((dest) => { if (dest === 'main') { setScreen('main'); setTab('daily'); } else setScreen(dest); }, []);
  const handleChartReady = useCallback((data) => { const converted = apiDataToPlanets(data); if (converted) setPlanets(converted); }, []);

  if (!fontsLoaded) return <View style={[st.screen, { justifyContent: 'center', alignItems: 'center' }]}><StarField /><IconStarDiamond size={28} color={C.gold} /></View>;

  if (screen === 'welcome') return <WelcomeScreen onNavigate={navigate} />;
  if (screen === 'signup') return <SignUpScreen onNavigate={navigate} />;
  if (screen === 'signin') return <SignInScreen onNavigate={navigate} />;
  if (screen === 'onboarding') return <OnboardingScreen onNavigate={navigate} onSaveBirthData={setBirthData} />;
  if (screen === 'compiling') return <CompilingScreen onNavigate={navigate} birthData={birthData} onChartReady={handleChartReady} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      {tab === 'daily' && <DailyReadingScreen planets={planets} />}
      {tab === 'chart' && <ChartScreen planets={planets} />}
      {tab === 'courses' && <CoursesScreen />}
      {tab === 'profile' && <ProfileScreen onNavigate={navigate} birthData={birthData} />}
      <TabBar active={tab} onSelect={setTab} />
    </View>
  );
}

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════
const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  label: { color: C.gold, fontSize: 11, letterSpacing: 2, marginBottom: 8, marginTop: 18, fontFamily: F.bodySemi, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 18, paddingVertical: 16, color: C.cream, fontSize: 15, fontFamily: F.body },
  btnGold: { backgroundColor: C.gold, borderRadius: 999, paddingVertical: 16, alignItems: 'center', shadowColor: C.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6 },
  btnGoldText: { color: C.bg, fontSize: 15, fontFamily: F.bodySemi, letterSpacing: 0.5 },
  btnOutline: { borderRadius: 999, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: C.gold },
  btnOutlineText: { color: C.gold, fontSize: 14, fontFamily: F.bodySemi },
  ampmBtn: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  ampmActive: { backgroundColor: C.gold, borderColor: C.gold },
  ampmText: { color: C.muted, fontFamily: F.bodySemi, fontSize: 13 },
  ampmTextActive: { color: C.bg },
  tagPill: { backgroundColor: 'rgba(212,165,116,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: C.creamDim, fontSize: 11, fontFamily: F.bodySemi },
});
