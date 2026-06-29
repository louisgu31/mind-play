import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMetaStore } from '../../metaStore';
import { CreatureSprite } from '../creatures/CreatureSprite';
import { EggSprite } from '../creatures/EggSprite';

interface Position {
  x: number;
  y: number;
}

const CottageSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <filter id="cottageShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#cottageShadow)">
      <rect x="20" y="68" width="60" height="18" fill="#78716C" rx="2"/>
      <rect x="22" y="70" width="56" height="14" fill="#6B7280" opacity="0.7" rx="1"/>
      <rect x="40" y="78" width="20" height="12" fill="#92400E" rx="2"/>
      <rect x="42" y="80" width="16" height="8" fill="#B45309" opacity="0.6" rx="1"/>
      <rect x="22" y="36" width="56" height="34" fill="#FDE68A" rx="2"/>
      <rect x="24" y="38" width="52" height="30" fill="#FFFBEB" opacity="0.5" rx="1"/>
      <path d="M 48 48 L 48 68 L 62 68 L 62 48 Q 55 40 48 48 Z" fill="#78350F"/>
      <path d="M 50 50 L 50 66 L 60 66 L 60 50 Q 55 44 50 50 Z" fill="#451A03" opacity="0.6"/>
      <circle cx="58" cy="58" r="1.5" fill="#FBBF24"/>
      <rect x="27" y="44" width="14" height="14" fill="#FFFBEB" stroke="#78350F" strokeWidth="1.5" rx="2"/>
      <rect x="29" y="46" width="10" height="10" fill="#FEF3C7"/>
      <line x1="34" y1="44" x2="34" y2="58" stroke="#78350F" strokeWidth="1.2"/>
      <line x1="27" y1="51" x2="41" y2="51" stroke="#78350F" strokeWidth="1.2"/>
      <ellipse cx="70" cy="48" rx="7" ry="7" fill="#FFFBEB" stroke="#78350F" strokeWidth="1.5"/>
      <ellipse cx="70" cy="48" rx="5" ry="5" fill="#FEF3C7"/>
      {[0,60,120,180,240,300].map(angle => (
        <line key={angle} x1="70" y1="41" x2="70" y2="55" stroke="#78350F" strokeWidth="0.8" transform={`rotate(${angle} 70 48)`}/>
      ))}
      <path d="M 15 36 L 50 6 L 85 36 Z" fill="#DC2626"/>
      <path d="M 17 34 L 50 9 L 83 34 Z" fill="#991B1B"/>
      {[0,1,2,3,4].map(row => {
        const offset = row % 2 === 0 ? 18 : 12;
        return [0,1,2,3].map(col => (
          <path key={`${row}-${col}`} d={`M ${offset+col*17} ${31-row*6} L ${offset+col*17+8} ${28-row*6} L ${offset+col*17+4} ${25-row*6} L ${offset+col*17-4} ${28-row*6} Z`} fill="#7F1D1D" opacity="0.5"/>
        ));
      })}
      <rect x="72" y="8" width="14" height="20" fill="#DC2626" rx="1"/>
      <rect x="73" y="10" width="12" height="16" fill="#B91C1C" opacity="0.7" rx="1"/>
      <rect x="70" y="5" width="18" height="5" fill="#57534E" rx="1"/>
      {[0,1,2].map(i => (
        <circle key={i} cx="79" cy={2-i*5} r={2.5+i*1.2} fill="#E5E7EB" opacity={0.5-i*0.15}>
          <animate attributeName="cy" values={`${2-i*5};${-9-i*5};${2-i*5}`} dur={`${2.5+i*0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values={`${0.5-i*0.15};0;${0.5-i*0.15}`} dur={`${2.5+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <g transform="translate(7,56)">
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x={i*11} y="0" width="2.5" height="12" fill="#78350F" rx="0.5"/>
            <rect x="0" y="4" width="44" height="2.5" fill="#78350F" rx="0.5"/>
          </g>
        ))}
      </g>
    </g>
  </svg>
);

const HatcherySVG = () => (
  <svg viewBox="0 0 100 110" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <filter id="hatcheryShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#hatcheryShadow)">
      <rect x="28" y="85" width="44" height="14" fill="#78716C" rx="2"/>
      <rect x="25" y="94" width="50" height="10" fill="#6B7280" rx="2"/>
      <rect x="18" y="32" width="64" height="56" fill="#57534E" rx="3"/>
      <rect x="20" y="35" width="60" height="50" fill="#6B7280" opacity="0.6" rx="2"/>
      <path d="M 32 52 L 32 88 L 68 88 L 68 52 Q 50 40 32 52 Z" fill="#374151"/>
      <path d="M 34 54 L 34 86 L 66 86 L 66 54 Q 50 44 34 54 Z" fill="#1F2937" opacity="0.6"/>
      <rect x="22" y="18" width="12" height="18" fill="#4B5563" rx="2"/>
      <rect x="66" y="18" width="12" height="18" fill="#4B5563" rx="2"/>
      <rect x="24" y="20" width="8" height="14" fill="#6B7280" opacity="0.5" rx="1"/>
      <rect x="68" y="20" width="8" height="14" fill="#6B7280" opacity="0.5" rx="1"/>
      <path d="M 28 22 Q 24 36 28 48 Q 32 60 28 68" stroke="#16A34A" strokeWidth="2.5" fill="none" opacity="0.9"/>
      <path d="M 72 22 Q 76 36 72 48 Q 68 60 72 68" stroke="#16A34A" strokeWidth="2.5" fill="none" opacity="0.9"/>
      {[22,44,62].map(y => (
        <ellipse key={`l-${y}`} cx="28" cy={y} rx="4" ry="2" fill="#22C55E" opacity="0.8"/>
      ))}
      {[22,44,62].map(y => (
        <ellipse key={`r-${y}`} cx="72" cy={y} rx="4" ry="2" fill="#22C55E" opacity="0.8"/>
      ))}
      <rect x="14" y="12" width="72" height="10" fill="#4B5563" rx="2"/>
      <rect x="16" y="13" width="68" height="5" fill="#6B7280" opacity="0.5" rx="1"/>
      <rect x="33" y="0" width="34" height="14" fill="#57534E" rx="2"/>
      <rect x="35" y="2" width="30" height="10" fill="#78716C" opacity="0.7" rx="1"/>
      <ellipse cx="50" cy="0" rx="18" ry="6" fill="#374151"/>
    </g>
  </svg>
);

const BigTreeSVG = () => (
  <svg viewBox="0 0 90 110" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <filter id="treeShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#treeShadow)">
      <ellipse cx="45" cy="105" rx="28" ry="6" fill="#000" opacity="0.2"/>
      <path d="M 40 42 L 37 105 L 53 105 L 50 42 Z" fill="#78350F"/>
      <path d="M 42 44 L 39 102 L 51 102 L 49 44 Z" fill="#92400E" opacity="0.6"/>
      {[0,1,2,3,4].map(i => (
        <line key={i} x1="41" y1={52+i*11} x2="49" y2={52+i*11} stroke="#57534E" strokeWidth="0.8" opacity="0.5"/>
      ))}
      <ellipse cx="45" cy="28" rx="38" ry="34" fill="#15803D"/>
      <ellipse cx="45" cy="26" rx="32" ry="28" fill="#16A34A"/>
      <ellipse cx="45" cy="24" rx="26" ry="23" fill="#22C55E" opacity="0.85"/>
      <ellipse cx="33" cy="20" rx="12" ry="10" fill="#4ADE80" opacity="0.7"/>
      <ellipse cx="57" cy="22" rx="10" ry="9" fill="#4ADE80" opacity="0.6"/>
      <ellipse cx="45" cy="16" rx="14" ry="12" fill="#86EFAC" opacity="0.5"/>
      <circle cx="27" cy="26" r="5.5" fill="#EF4444" opacity="0.9"/>
      <circle cx="54" cy="18" r="4.5" fill="#3B82F6" opacity="0.9"/>
      <circle cx="45" cy="10" r="6" fill="#FBBF24" opacity="0.95"/>
      <circle cx="38" cy="14" r="3.5" fill="#FDE047" opacity="0.85"/>
      <circle cx="52" cy="17" r="3.5" fill="#FDE047" opacity="0.85"/>
    </g>
  </svg>
);

const WaterfallSVG = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8"/>
        <stop offset="30%" stopColor="#0EA5E9"/>
        <stop offset="65%" stopColor="#2563EB"/>
        <stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
      <radialGradient id="waterMist" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="70" cy="132" rx="55" ry="28" fill="url(#waterMist)"/>
    <ellipse cx="70" cy="135" rx="45" ry="22" fill="url(#waterMist)" opacity="0.85"/>
    <path d="M 25 0 Q 65 50 45 90 Q 25 130 50 140" stroke="url(#waterfallGrad)" strokeWidth="95" strokeLinecap="round" fill="none"/>
    <path d="M 30 2 Q 65 48 48 88 Q 30 125 52 138" stroke="#60A5FA" strokeWidth="70" strokeLinecap="round" fill="none"/>
    <path d="M 38 5 Q 68 45 52 82 Q 38 118 56 132" stroke="#93C5FD" strokeWidth="45" strokeLinecap="round" fill="none"/>
    <path d="M 8 0 Q 70 10 132 0" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" opacity="0.95"/>
    <path d="M 15 2 Q 70 14 125 2" stroke="#F0F9FF" strokeWidth="8" strokeLinecap="round" opacity="0.75"/>
    <path d="M 0 0 Q 70 8 140 0 Q 145 15 140 0" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.6"/>
    <ellipse cx="52" cy="35" rx="12" ry="7" fill="#FFFFFF" opacity="0.65"/>
    <ellipse cx="82" cy="78" rx="11" ry="6.5" fill="#FFFFFF" opacity="0.55"/>
    {[0,1,2,3,4].map(i => (
      <ellipse key={i} cx={42+i*16} cy={28+i*22} rx={5+i} ry={3+i*0.8} fill="#F0F9FF" opacity={0.6-i*0.1}>
        <animate attributeName="ry" values={`${3+i*0.8};${5+i*1.2};${3+i*0.8}`} dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>
      </ellipse>
    ))}
  </svg>
);

const IslandRenderer: React.FC = () => {
  const { creatures, eggs, interactWithEgg } = useMetaStore();

  const creaturePositions = useMemo(() => {
    const positions: { creature: typeof creatures[0]; position: Position }[] = [];
    const used: Position[] = [];

    creatures.forEach((creature) => {
      let pos: Position;
      let attempts = 0;
      do {
        const zones = [
          { x: 18, w: 22, y: 52, h: 20 },
          { x: 40, w: 25, y: 50, h: 22 },
          { x: 64, w: 20, y: 52, h: 20 }
        ];
        const z = zones[Math.floor(Math.random() * zones.length)];
        pos = {
          x: z.x + Math.random() * z.w,
          y: z.y + Math.random() * z.h
        };
        pos.y = Math.max(50, Math.min(72, pos.y));
        pos.x = Math.max(15, Math.min(86, pos.x));
        attempts++;
      } while (
        attempts < 25 &&
        used.some((p) => Math.sqrt(Math.pow(pos.x - p.x, 2) + Math.pow(pos.y - p.y, 2)) < 12)
      );
      used.push(pos);
      positions.push({ creature, position: pos });
    });

    return positions;
  }, [creatures]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-50"/>
      <motion.div
        className="absolute top-6 right-28 w-18 h-18 bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-300 rounded-full blur-sm shadow-xl shadow-amber-200"
        animate={{ scale: [1, 1.18, 1], opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {[0,1,2,3].map(i => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full blur-2xl opacity-0.85"
          initial={{ x: -280, top: 38+i*48 }}
          animate={{ x: [-280, 1600, -280], scale: [1, 1.22, 1] }}
          transition={{
            x: { duration: 95+i*15, repeat: Infinity, ease: 'linear' },
            scale: { duration: 13+i*3.5, repeat: Infinity, ease: 'easeInOut', delay: i*2.2 }
          }}
          style={{ width: 170+i*45, height: 85+i*22 }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[92%] h-[92%]">
          <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-3xl">
            <defs>
              <radialGradient id="grassMain2" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#86EFAC"/>
                <stop offset="35%" stopColor="#4ADE80"/>
                <stop offset="70%" stopColor="#22C55E"/>
                <stop offset="100%" stopColor="#16A34A"/>
              </radialGradient>
              <radialGradient id="grassHighlight2" cx="50%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.85"/>
                <stop offset="40%" stopColor="#6EE7B7" stopOpacity="0.45"/>
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="dirtLayer12" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9A3412"/>
                <stop offset="30%" stopColor="#78350F"/>
                <stop offset="60%" stopColor="#5C1F0C"/>
                <stop offset="100%" stopColor="#3D1207"/>
              </linearGradient>
              <filter id="cliffShadow2" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#1F2937" floodOpacity="0.55"/>
              </filter>
            </defs>
            <g filter="url(#cliffShadow2)">
              <path d="M 100 180 Q 200 120 400 110 Q 600 105 720 130 Q 760 220 750 300 Q 740 380 650 420 Q 480 460 300 450 Q 150 440 80 380 Q 30 320 100 180 Z" fill="url(#dirtLayer12)"/>
              <path d="M 120 175 Q 210 125 400 115 Q 590 110 700 135 Q 740 215 730 295 Q 720 375 640 410 Q 480 445 310 438 Q 170 430 100 375 Q 50 320 120 175 Z" fill="#78350F"/>
            </g>
            {[...Array(15)].map((_,i) => (
              <path key={i} d={`M ${100+i*48} ${340+Math.sin(i*1.4)*30} Q ${115+i*48+(i%2?20:-18)} ${385+Math.cos(i*1.2)*35} ${108+i*48} ${350+Math.sin(i*1.4)*32}`} stroke="#1C1917" strokeWidth="2.5" fill="none" opacity="0.55"/>
            ))}
            <path d="M 120 175 Q 210 125 400 115 Q 590 110 700 135 Q 740 215 730 295 Q 720 375 640 410 Q 480 445 310 438 Q 170 430 100 375 Q 50 320 120 175 Z" fill="url(#grassMain2)"/>
            <path d="M 120 175 Q 210 125 400 115 Q 590 110 700 135 Q 740 215 730 295 Q 720 375 640 410 Q 480 445 310 438 Q 170 430 100 375 Q 50 320 120 175 Z" fill="url(#grassHighlight2)"/>
            {[...Array(28)].map((_,i)=>{
              const angle=(i/28)*Math.PI*2;
              const radius=280+Math.sin(i*2.6)*28;
              return (
                <ellipse key={i} cx={400+Math.cos(angle)*radius} cy={280+Math.sin(angle)*(radius*0.38)} rx={18+Math.random()*12} ry={9+Math.random()*6} fill="#15803D" opacity="0.65"/>
              );
            })}
            {[
              {x:145,y:260,rx:12,ry:8},
              {x:265,y:270,rx:10,ry:6},
              {x:555,y:265,rx:13,ry:8},
              {x:680,y:250,rx:11,ry:7},
              {x:400,y:280,rx:9,ry:5.5},
              {x:190,y:230,rx:8,ry:5},
              {x:345,y:235,rx:7,ry:4.5},
              {x:580,y:233,rx:9,ry:5.5},
            ].map((rock,i)=>(
              <ellipse key={i} cx={rock.x} cy={rock.y} rx={rock.rx} ry={rock.ry} fill="#6B7280" opacity="0.88"/>
            ))}
            {[...Array(24)].map((_,i)=>{
              const x=115+(i%6)*108;
              const y=250+Math.floor(i/6)*28+Math.sin(i*2.2)*12;
              const colors=['#F43F5E','#FBBF24','#EC4899','#3B82F6','#8B5CF6','#F97316'];
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={5} fill={colors[i%6]}/>
                  <circle cx={x} cy={y} r={2.8} fill="#FBBF24"/>
                </g>
              );
            })}
          </svg>
          <div className="absolute w-[12%] aspect-[3/5]" style={{left:'42%', top:'42%'}}>
            <WaterfallSVG/>
          </div>
          <div className="absolute w-[22%] aspect-square" style={{left:'8%', top:'45%'}}>
            <CottageSVG/>
          </div>
          <div className="absolute w-[15%] aspect-[10/11]" style={{left:'70%', top:'47%'}}>
            <HatcherySVG/>
          </div>
          <div className="absolute w-[13%] aspect-[9/11]" style={{left:'40%', top:'42%'}}>
            <BigTreeSVG/>
          </div>
          <svg viewBox="0 0 45 70" className="absolute w-[5%] aspect-[9/14]" style={{left:'14%', top:'58%'}}>
            <rect x="19" y="0" width="7" height="48" fill="#78350F"/>
            <rect x="10" y="48" width="25" height="9" fill="#78350F" rx="2"/>
            <rect x="7" y="3" width="31" height="31" fill="#92400E" rx="3"/>
            <rect x="10" y="6" width="25" height="25" fill="#B45309" opacity="0.6" rx="2"/>
            <circle cx="22.5" cy="16" r="6" fill="#FBBF24"/>
            <path d="M 17 16 L 28 16 M 22.5 11 L 22.5 21" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          {[...Array(30)].map((_,i)=>{
            return (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{left:`${14+Math.random()*72}%`,top:`${50+Math.random()*30}%`}}
                initial={{opacity:0,scale:0,y:0}}
                animate={{opacity:[0,1,0],scale:[0,1,0],y:[-7,-28,-7]}}
                transition={{duration:2.3+Math.random()*2.3,repeat:Infinity,delay:Math.random()*5.5,ease:'easeInOut'}}
              >
                <div className="bg-yellow-100 rounded-full" style={{width:1.5+Math.random()*3.2,height:1.5+Math.random()*3.2,boxShadow:'0 0 7px 2.5px rgba(254,249,195,0.85)'}}/>
              </motion.div>
            );
          })}
          <div className="absolute z-30" style={{left:'72%', top:'45%'}}>
            {eggs.length>0 && (
              <motion.div
                initial={{scale:0,opacity:0}}
                animate={{scale:1,opacity:1,y:[0,-5,0]}}
                transition={{scale:{duration:0.5},opacity:{duration:0.5},y:{duration:2.4,repeat:Infinity,ease:'easeInOut'}}}
                onClick={()=>eggs[0] && interactWithEgg(eggs[0].id)}
                className="cursor-pointer hover:scale-115 transition-transform"
              >
                <EggSprite egg={eggs[0]} size={60}/>
              </motion.div>
            )}
          </div>
          <div className="absolute inset-0 z-50 pointer-events-none">
            {creaturePositions.length>0 ? creaturePositions.map(({creature,position},index)=>(
              <div
                key={creature.id}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                style={{left:`${position.x}%`,top:`${position.y}%`}}
              >
                <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/26" style={{bottom:'-12px',width:'52px',height:'11px',filter:'blur(4px)'}}/>
                <motion.div
                  initial={{scale:0,opacity:0}}
                  animate={{scale:1,opacity:1,y:[0,-10,0]}}
                  transition={{
                    scale:{duration:0.5,ease:'easeOut',delay:index*0.16},
                    opacity:{duration:0.5,ease:'easeOut',delay:index*0.16},
                    y:{duration:2.8+index*0.22,repeat:Infinity,ease:'easeInOut',delay:index*0.16}
                  }}
                >
                  <CreatureSprite creature={creature} size={72}/>
                </motion.div>
              </div>
            )) : (
              [
                {type:'sprout',rarity:'common',x:28,y:58},
              {type:'ember',rarity:'common',x:48,y:55},
              {type:'aqua',rarity:'common',x:68,y:60},
              ].map((fallback,i)=>(
                <div
                  key={`fallback-${i}`}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                  style={{left:`${fallback.x}%`,top:`${fallback.y}%`}}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/26" style={{bottom:'-12px',width:'52px',height:'11px',filter:'blur(4px)'}}/>
                  <motion.div
                    initial={{scale:0,opacity:0}}
                    animate={{scale:1,opacity:1,y:[0,-10,0]}}
                    transition={{
                      scale:{duration:0.5,ease:'easeOut',delay:i*0.16},
                      opacity:{duration:0.5,ease:'easeOut',delay:i*0.16},
                      y:{duration:2.8+i*0.22,repeat:Infinity,ease:'easeInOut',delay:i*0.16}
                    }}
                  >
                    <svg width="72" height="72" viewBox="0 0 64 64">
                      <ellipse cx="32" cy="43" rx="18" ry="16" fill={fallback.type==='sprout'?'#4ADE80':fallback.type==='ember'?'#F97316':'#38BDF8'}/>
                      <ellipse cx="32" cy="42" rx="15" ry="13" fill={fallback.type==='sprout'?'#86EFAC':fallback.type==='ember'?'#FDBA74':'#7DD3FC'}/>
                      <ellipse cx="19" cy="48" rx="5" ry="3.8" fill="#FCA5A5" opacity="0.8"/>
                      <ellipse cx="45" cy="48" rx="5" ry="3.8" fill="#FCA5A5" opacity="0.8"/>
                      <circle cx="24" cy="37" r="6" fill={fallback.type==='sprout'?'#15803D':fallback.type==='ember'?'#7C2D12':'#0C4A6E'}/>
                      <circle cx="40" cy="37" r="6" fill={fallback.type==='sprout'?'#15803D':fallback.type==='ember'?'#7C2D12':'#0C4A6E'}/>
                      <circle cx="25" cy="36" r="3" fill="#FFFFFF"/>
                      <circle cx="41" cy="36" r="3" fill="#FFFFFF"/>
                      <circle cx="25.5" cy="35.2" r="1.4" fill={fallback.type==='sprout'?'#FEF3C7':fallback.type==='ember'?'#FBBF24':'#93C5FD'}/>
                      <circle cx="41.5" cy="35.2" r="1.4" fill={fallback.type==='sprout'?'#FEF3C7':fallback.type==='ember'?'#FBBF24':'#93C5FD'}/>
                      <path d="M 22 50 Q 32 56 42 50" fill="none" stroke={fallback.type==='sprout'?'#15803D':fallback.type==='ember'?'#7C2D12':'#0C4A6E'} strokeWidth="3" strokeLinecap="round"/>
                      {fallback.type==='sprout' && (
                        <>
                          <ellipse cx="32" cy="20" rx="6" ry="12.5" fill="#22C55E" transform="rotate(-30 32 20)"/>
                          <ellipse cx="32" cy="20" rx="6" ry="12.5" fill="#22C55E" transform="rotate(30 32 20)"/>
                          <ellipse cx="32" cy="18" rx="4.2" ry="9.5" fill="#4ADE80"/>
                        </>
                      )}
                      {fallback.type==='ember' && (
                        <>
                          <path d="M 32 12 L 38 29 L 32 26 L 26 29 Z" fill="#FBBF24"/>
                          <path d="M 32 15 L 35 26 L 32 24 L 29 26 Z" fill="#FDE047"/>
                        </>
                      )}
                      {fallback.type==='aqua' && (
                        <>
                          <path d="M 49 40 L 62 35 L 62 50 L 49 46 Z" fill="#0EA5E9"/>
                          <circle cx="55" cy="27" r="3.5" fill="#FFFFFF" opacity="0.9"/>
                        </>
                      )}
                    </svg>
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { IslandRenderer };
