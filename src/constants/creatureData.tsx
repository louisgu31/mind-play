import { CreatureType, CreatureRarity } from '../metaStore';
import React from 'react';

export const getCreatureSpritePath = (type: CreatureType, stage: number): string => {
  const basePath = '/src/assets/creatures';
  let baseType: CreatureType = type;
  
  if (['crystalSprout', 'worldTree'].includes(type)) baseType = 'sprout';
  if (['shadowEmber', 'phoenix'].includes(type)) baseType = 'ember';
  if (['coralAqua'].includes(type)) baseType = 'aqua';
  if (['stormVolt'].includes(type)) baseType = 'volt';
  
  return `${basePath}/${baseType}-stage${stage}.svg`;
};

const getRarityGlowFilter = (rarity: CreatureRarity) => {
  switch(rarity) {
    case 'rare':
      return 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.9))';
    case 'epic':
      return 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.95))';
    case 'legendary':
      return 'drop-shadow(0 0 22px rgba(245, 158, 11, 1))';
    default:
      return 'drop-shadow(0 5px 8px rgba(0, 0, 0, 0.22))';
  }
};

const getStageScale = (stage: number) => {
  const scaleMap: Record<number, number> = {
    1: 0.92,
    2: 1,
    3: 1.22
  };
  return scaleMap[stage] || 0.92;
};

const RenderSprout = ({ stage }: { stage: number }) => {
  const scale = getStageScale(stage);
  
  return (
    <g transform={`scale(${scale}) translate(${(1-scale)*32}, ${(1-scale)*32})`}>
      <ellipse cx="32" cy="43" rx="17" ry="15" fill="#4ADE80" />
      <ellipse cx="32" cy="42" rx="14" ry="12" fill="#86EFAC" />
      <ellipse cx="32" cy="41" rx="11" ry="10" fill="#BBF7D0" opacity="0.55" />
      
      <ellipse cx="20" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.75" />
      <ellipse cx="44" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.75" />
      
      <circle cx="24" cy="39" r="5.5" fill="#15803D" />
      <circle cx="40" cy="39" r="5.5" fill="#15803D" />
      <circle cx="25" cy="38" r="2.8" fill="white" />
      <circle cx="41" cy="38" r="2.8" fill="white" />
      <circle cx="25.5" cy="37.2" r="1.3" fill="#FEF3C7" />
      <circle cx="41.5" cy="37.2" r="1.3" fill="#FEF3C7" />
      
      <path d="M 23 50 Q 32 55.5 41 50" fill="none" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" />
      
      {stage >= 1 && (
        <g>
          <ellipse cx="32" cy="21" rx="5.5" ry="11.5" fill="#22C55E" transform="rotate(-30 32 21)" />
          <ellipse cx="32" cy="21" rx="5.5" ry="11.5" fill="#22C55E" transform="rotate(30 32 21)" />
          <ellipse cx="32" cy="19" rx="3.8" ry="8.5" fill="#4ADE80" />
          <path d="M 32 10 Q 30 16 32 21" stroke="#15803D" fill="none" strokeWidth="1.6" opacity="0.5" />
        </g>
      )}
      
      {stage >= 2 && (
        <g>
          <circle cx="26" cy="13" r="5" fill="#FBBF24" />
          <circle cx="38" cy="13" r="5" fill="#FBBF24" />
          <circle cx="32" cy="8" r="5.8" fill="#FDE047" />
          <circle cx="22" cy="17" r="3.3" fill="#FACC15" />
          <circle cx="42" cy="17" r="3.3" fill="#FACC15" />
          <circle cx="26" cy="13" r="1.7" fill="#92400E" />
          <circle cx="38" cy="13" r="1.7" fill="#92400E" />
          <circle cx="32" cy="8" r="2" fill="#92400E" />
        </g>
      )}
      
      {stage >= 3 && (
        <g>
          <ellipse cx="32" cy="4.5" rx="13" ry="5.5" fill="#15803D" />
          <ellipse cx="24" cy="11.5" rx="6.5" ry="4.5" fill="#16A34A" />
          <ellipse cx="40" cy="11.5" rx="6.5" ry="4.5" fill="#16A34A" />
          <circle cx="20" cy="13.5" r="3.3" fill="#FBBF24" />
          <circle cx="44" cy="13.5" r="3.3" fill="#FBBF24" />
          <ellipse cx="32" cy="7.5" rx="2.4" ry="3.5" fill="#C4B5FD" />
          <ellipse cx="32" cy="6.5" rx="1.4" ry="2.1" fill="#FEF3C7" />
        </g>
      )}
    </g>
  );
};

const RenderEmber = ({ stage }: { stage: number }) => {
  const scale = getStageScale(stage);
  
  return (
    <g transform={`scale(${scale}) translate(${(1-scale)*32}, ${(1-scale)*32})`}>
      <ellipse cx="32" cy="43" rx="16" ry="15" fill="#F97316" />
      <ellipse cx="32" cy="42" rx="13" ry="12" fill="#FDBA74" />
      <ellipse cx="32" cy="41" rx="10" ry="9.5" fill="#FEF3C7" opacity="0.55" />
      
      <ellipse cx="20" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.85" />
      <ellipse cx="44" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.85" />
      
      <circle cx="24" cy="39" r="5.5" fill="#7C2D12" />
      <circle cx="40" cy="39" r="5.5" fill="#7C2D12" />
      <circle cx="25" cy="38" r="2.8" fill="white" />
      <circle cx="41" cy="38" r="2.8" fill="white" />
      <circle cx="25.5" cy="37.2" r="1.3" fill="#FBBF24" />
      <circle cx="41.5" cy="37.2" r="1.3" fill="#FBBF24" />
      
      <path d="M 24 51 Q 32 56.5 40 51" fill="none" stroke="#7C2D12" strokeWidth="2.8" strokeLinecap="round" />
      
      {stage >= 1 && (
        <g>
          <path d="M 32 13 L 37 28 L 32 25 L 27 28 Z" fill="#FBBF24" />
          <path d="M 32 16 L 35 25 L 32 23 L 29 25 Z" fill="#FDE047" />
          <circle cx="32" cy="20" r="1.7" fill="#FEF3C7" opacity="0.95" />
        </g>
      )}
      
      {stage >= 2 && (
        <g>
          <path d="M 22 16 L 28 31 L 23 28 L 18 31 Z" fill="#F97316" />
          <path d="M 42 16 L 48 31 L 43 28 L 38 31 Z" fill="#F97316" />
          <path d="M 32 8 L 40 23 L 32 19 L 24 23 Z" fill="#FBBF24" />
          <path d="M 32 12 L 36 21 L 32 18 L 28 21 Z" fill="#FDE047" />
        </g>
      )}
      
      {stage >= 3 && (
        <g>
          <path d="M 32 3 L 45 20 L 32 14 L 19 20 Z" fill="#EF4444" />
          <path d="M 32 8 L 41 20.5 L 32 15.5 L 23 20.5 Z" fill="#F97316" />
          <path d="M 32 13 L 37.5 21.5 L 32 18.5 L 26.5 21.5 Z" fill="#FBBF24" />
          <circle cx="32" cy="12" r="4.5" fill="#FDE047" />
          <circle cx="18" cy="21" r="3.3" fill="#F97316" />
          <circle cx="46" cy="21" r="3.3" fill="#F97316" />
          <circle cx="26" cy="9.5" r="1.7" fill="#FEF3C7" />
          <circle cx="38" cy="9.5" r="1.7" fill="#FEF3C7" />
        </g>
      )}
    </g>
  );
};

const RenderAqua = ({ stage }: { stage: number }) => {
  const scale = getStageScale(stage);
  
  return (
    <g transform={`scale(${scale}) translate(${(1-scale)*32}, ${(1-scale)*32})`}>
      <ellipse cx="32" cy="43" rx="18" ry="16" fill="#38BDF8" />
      <ellipse cx="32" cy="42" rx="15" ry="13" fill="#7DD3FC" />
      <ellipse cx="32" cy="41" rx="12" ry="10.5" fill="#E0F2FE" opacity="0.55" />
      
      <ellipse cx="20" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.65" />
      <ellipse cx="44" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.65" />
      
      <circle cx="24" cy="39" r="5.5" fill="#0C4A6E" />
      <circle cx="40" cy="39" r="5.5" fill="#0C4A6E" />
      <circle cx="25" cy="38" r="2.8" fill="white" />
      <circle cx="41" cy="38" r="2.8" fill="white" />
      <circle cx="25.5" cy="37.2" r="1.3" fill="#93C5FD" />
      <circle cx="41.5" cy="37.2" r="1.3" fill="#93C5FD" />
      
      <path d="M 24 51 Q 32 56.5 40 51" fill="none" stroke="#0C4A6E" strokeWidth="2.8" strokeLinecap="round" />
      
      {stage >= 1 && (
        <g>
          <path d="M 50 40 L 62 36 L 62 49 L 50 45 Z" fill="#0EA5E9" />
          <ellipse cx="18" cy="43" rx="5.8" ry="8.2" fill="#38BDF8" />
          <ellipse cx="57" cy="42" rx="2.3" ry="4.6" fill="#BAE6FD" opacity="0.75" />
        </g>
      )}
      
      {stage >= 2 && (
        <g>
          <ellipse cx="16" cy="35" rx="6.8" ry="9.2" fill="#0EA5E9" />
          <ellipse cx="16" cy="51" rx="6.8" ry="9.2" fill="#0EA5E9" />
          <path d="M 52 36 L 69 30 L 69 52 L 52 46 Z" fill="#0284C7" />
          <circle cx="54" cy="41" r="2.8" fill="#93C5FD" opacity="0.95" />
        </g>
      )}
      
      {stage >= 3 && (
        <g>
          <ellipse cx="32" cy="28.5" rx="20" ry="7.8" fill="#0EA5E9" opacity="0.45" />
          <ellipse cx="32" cy="56.5" rx="20" ry="7.8" fill="#0EA5E9" opacity="0.45" />
          <ellipse cx="14" cy="43" rx="9.2" ry="11.5" fill="#0284C7" opacity="0.55" />
          <ellipse cx="50" cy="43" rx="9.2" ry="11.5" fill="#0284C7" opacity="0.55" />
          <circle cx="21" cy="37" r="2.8" fill="#93C5FD" opacity="0.95" />
          <circle cx="43" cy="37" r="2.8" fill="#93C5FD" opacity="0.95" />
          <circle cx="32" cy="27" r="2" fill="#FEF3C7" opacity="0.85" />
        </g>
      )}
    </g>
  );
};

const RenderVolt = ({ stage }: { stage: number }) => {
  const scale = getStageScale(stage);
  
  return (
    <g transform={`scale(${scale}) translate(${(1-scale)*32}, ${(1-scale)*32})`}>
      <ellipse cx="32" cy="43" rx="16" ry="15" fill="#FACC15" />
      <ellipse cx="32" cy="42" rx="13" ry="12" fill="#FDE68A" />
      <ellipse cx="32" cy="41" rx="10" ry="9.5" fill="#FEF3C7" opacity="0.55" />
      
      <ellipse cx="20" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.75" />
      <ellipse cx="44" cy="48" rx="4.5" ry="3.5" fill="#FCA5A5" opacity="0.75" />
      
      <circle cx="24" cy="39" r="5.5" fill="#854D0E" />
      <circle cx="40" cy="39" r="5.5" fill="#854D0E" />
      <circle cx="25" cy="38" r="2.8" fill="white" />
      <circle cx="41" cy="38" r="2.8" fill="white" />
      <circle cx="25.5" cy="37.2" r="1.3" fill="#FACC15" />
      <circle cx="41.5" cy="37.2" r="1.3" fill="#FACC15" />
      
      <path d="M 24 51 Q 32 56.5 40 51" fill="none" stroke="#854D0E" strokeWidth="2.8" strokeLinecap="round" />
      
      {stage >= 1 && (
        <g>
          <path d="M 32 12 L 37 26 L 34 24 L 36 32 L 28 24 L 31 26 Z" fill="#EAB308" />
          <path d="M 32 15 L 35 23 L 32 21.5 L 29 23 Z" fill="#FEF3C7" />
          <circle cx="32" cy="19" r="1.7" fill="#FEF3C7" opacity="0.95" />
        </g>
      )}
      
      {stage >= 2 && (
        <g>
          <path d="M 21 15 L 26 29 L 23 27 L 25 34 L 18 26 L 21 28 Z" fill="#FACC15" />
          <path d="M 43 15 L 48 29 L 45 27 L 47 34 L 40 26 L 43 28 Z" fill="#FACC15" />
          <path d="M 32 7 L 39 22 L 32 18 L 25 22 Z" fill="#EAB308" />
        </g>
      )}
      
      {stage >= 3 && (
        <g>
          <path d="M 32 2 L 43 18 L 36 16 L 47 30 L 32 20 L 35 22 Z" fill="#F97316" />
          <path d="M 32 7 L 40 19 L 32 15 L 24 19 Z" fill="#FACC15" />
          <path d="M 32 12 L 37.5 20.5 L 32 17.5 L 26.5 20.5 Z" fill="#FEF3C7" />
          <circle cx="32" cy="11" r="4" fill="#FEF3C7" />
          <circle cx="17" cy="20.5" r="3" fill="#FACC15" />
          <circle cx="47" cy="20.5" r="3" fill="#FACC15" />
          <circle cx="26" cy="9" r="1.7" fill="#FEF3C7" />
          <circle cx="38" cy="9" r="1.7" fill="#FEF3C7" />
        </g>
      )}
    </g>
  );
};

const RenderWorldTree = () => {
  return (
    <g transform="scale(1.35) translate(-10, -10)">
      <rect x="25" y="28" width="14" height="36" fill="#78350F" rx="4" />
      <rect x="27" y="30" width="10" height="32" fill="#92400E" opacity="0.55" rx="3" />
      
      <ellipse cx="32" cy="19" rx="23" ry="18.5" fill="#15803D" />
      <ellipse cx="32" cy="22" rx="19.5" ry="15" fill="#16A34A" />
      <ellipse cx="32" cy="24.5" rx="16" ry="11.5" fill="#22C55E" opacity="0.8" />
      
      <circle cx="23" cy="15" r="5.5" fill="#EF4444" />
      <circle cx="41" cy="15" r="5.5" fill="#3B82F6" />
      <circle cx="32" cy="9" r="6.2" fill="#FBBF24" />
      
      <ellipse cx="32" cy="58" rx="18.5" ry="9.5" fill="#78350F" />
      <ellipse cx="32" cy="57" rx="16" ry="7.5" fill="#92400E" opacity="0.55" />
      
      <circle cx="21" cy="13" r="1.9" fill="#FEF3C7" opacity="0.85" />
      <circle cx="43" cy="13" r="1.9" fill="#FEF3C7" opacity="0.85" />
      <circle cx="32" cy="7" r="2.3" fill="#FEF3C7" opacity="0.95" />
    </g>
  );
};

const RenderPhoenix = () => {
  return (
    <g transform="scale(1.25) translate(-7, -7)">
      <ellipse cx="32" cy="41" rx="14.5" ry="17" fill="#DC2626" />
      <ellipse cx="32" cy="40" rx="11.5" ry="14" fill="#F97316" opacity="0.85" />
      
      <ellipse cx="17" cy="42" rx="12.5" ry="10.5" fill="#F97316" transform="rotate(-28 17 42)" />
      <ellipse cx="47" cy="42" rx="12.5" ry="10.5" fill="#F97316" transform="rotate(28 47 42)" />
      
      <path d="M 32 54 L 39 70 L 32 63 L 25 70 Z" fill="#FBBF24" />
      <path d="M 32 56 L 36 66 L 32 61 L 28 66 Z" fill="#FDE047" />
      
      <circle cx="32" cy="26" r="9" fill="#EF4444" />
      <circle cx="32" cy="27" r="7" fill="#F97316" opacity="0.75" />
      
      <circle cx="27" cy="25" r="3" fill="#FEF3C7" />
      <circle cx="37" cy="25" r="3" fill="#FEF3C7" />
      <circle cx="27" cy="24" r="1.4" fill="#DC2626" />
      <circle cx="37" cy="24" r="1.4" fill="#DC2626" />
      
      <path d="M 32 16 L 38 26 L 32 22 L 26 26 Z" fill="#FBBF24" />
      
      <circle cx="23" cy="30" r="2.3" fill="#FBBF24" opacity="0.85" />
      <circle cx="41" cy="30" r="2.3" fill="#FBBF24" opacity="0.85" />
      <circle cx="32" cy="19" r="2.8" fill="#FEF3C7" opacity="0.95" />
    </g>
  );
};

export const CreatureSVG: React.FC<{
  type: CreatureType;
  stage: number;
  rarity: CreatureRarity;
  size: number;
}> = ({ type, stage, rarity, size }) => {
  const getCreatureSVG = () => {
    switch (type) {
      case 'sprout':
      case 'crystalSprout':
        return <RenderSprout stage={stage} />;
      case 'ember':
      case 'shadowEmber':
        return <RenderEmber stage={stage} />;
      case 'aqua':
      case 'coralAqua':
        return <RenderAqua stage={stage} />;
      case 'volt':
      case 'stormVolt':
        return <RenderVolt stage={stage} />;
      case 'worldTree':
        return <RenderWorldTree />;
      case 'phoenix':
        return <RenderPhoenix />;
      default:
        return <RenderSprout stage={stage} />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ 
        filter: getRarityGlowFilter(rarity) 
      }}
    >
      {getCreatureSVG()}
    </svg>
  );
};

export const getCreatureElementColor = (type: CreatureType): string => {
  switch (type) {
    case 'sprout':
    case 'crystalSprout':
    case 'worldTree':
      return '#4ADE80';
    case 'ember':
    case 'shadowEmber':
    case 'phoenix':
      return '#FB923C';
    case 'aqua':
    case 'coralAqua':
      return '#60A5FA';
    case 'volt':
    case 'stormVolt':
      return '#FACC15';
    default:
      return '#4ADE80';
  }
};

export const getRarityColor = (rarity: CreatureRarity): string => {
  switch (rarity) {
    case 'common':
      return '#9CA3AF';
    case 'rare':
      return '#60A5FA';
    case 'epic':
      return '#A855F7';
    case 'legendary':
      return '#F59E0B';
  }
};

export const getRarityGlowClass = (rarity: CreatureRarity): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-200';
    case 'rare':
      return 'bg-blue-200';
    case 'epic':
      return 'bg-purple-300';
    case 'legendary':
      return 'bg-yellow-300';
  }
};

export const getEggElementColor = (tier: string): string => {
  switch (tier) {
    case 'common':
      return '#9CA3AF';
    case 'rare':
      return '#60A5FA';
    case 'epic':
      return '#A855F7';
    case 'legendary':
      return '#F59E0B';
    default:
      return '#9CA3AF';
  }
};

export const getEggTierGlowClass = (tier: string): string => {
  switch (tier) {
    case 'common':
      return 'bg-gray-200/50';
    case 'rare':
      return 'bg-blue-300/50';
    case 'epic':
      return 'bg-purple-300/50';
    case 'legendary':
      return 'bg-yellow-300/50';
    default:
      return 'bg-gray-200/50';
  }
};
