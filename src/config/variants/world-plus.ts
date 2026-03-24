/**
 * World Monitor Plus Variant - 中国教育直播扩展
 *
 * 新增中国教育品牌和直播平台 Layer
 * 通过 import 方式继承原有 world variant，不修改原文件
 */

import type { PanelConfig, MapLayers } from '@/types';
import type { VariantConfig } from './base';

// 导入原有 full variant 配置
export * from './full';

// 导入中国教育扩展
export * from '../education';

/**
 * 新增 Panel 配置
 * 在原有基础上追加教育相关面板
 */
export const WORLD_PLUS_PANELS: Record<string, PanelConfig> = {
  ...DEFAULT_PANELS, // 继承原有面板
  // 新增教育相关面板
  education: { name: 'Education Intelligence', enabled: true, priority: 1 },
  'china-edu': { name: 'China Education', enabled: true, priority: 2 },
  'live-streaming': { name: 'Live Streaming Signals', enabled: true, priority: 2 },
};

/**
 * 新增 Map Layers 配置
 * 追加中国教育品牌和直播平台 Layer
 */
export const WORLD_PLUS_MAP_LAYERS: MapLayers = {
  ...DEFAULT_MAP_LAYERS, // 继承原有所有 layer

  // 新增：中国教育品牌 Layer
  chinaEduBrands: true,
  chinaLiveStreaming: true,

  // 教育相关现有 layer 增强显示
  protests: true, // 包含教育抗议/维权活动
  hotspots: true, // 包含教育热点事件
};

/**
 * 移动端 Map Layers 配置
 */
export const WORLD_PLUS_MOBILE_MAP_LAYERS: MapLayers = {
  ...DEFAULT_MAP_LAYERS, // 继承原有移动端配置

  // 移动端只显示核心教育信息
  chinaEduBrands: false,
  chinaLiveStreaming: true, // 直播信号在移动端更实用
};

/**
 * Variant 元数据配置
 */
export const WORLD_PLUS_VARIANT_CONFIG: VariantConfig = {
  name: 'world-plus',
  description: 'World Monitor+ (含中国教育直播) - 基于 full variant 扩展，新增中国在线教育品牌和直播平台信号监测',
  panels: WORLD_PLUS_PANELS,
  mapLayers: WORLD_PLUS_MAP_LAYERS,
  mobileMapLayers: WORLD_PLUS_MOBILE_MAP_LAYERS,
};

/**
 * 获取 world-plus 特定配置
 * 用于运行时动态加载
 */
export function getWorldPlusConfig(): VariantConfig {
  return WORLD_PLUS_VARIANT_CONFIG;
}

/**
 * 获取教育 Layer 列表
 * 用于地图渲染
 */
export function getEducationLayerIds(): string[] {
  return [
    'chinaEduBrands',
    'chinaLiveStreaming',
  ];
}
