/**
 * China Education Live Streaming Layer Configuration
 *
 * 新增中国在线教育品牌和直播平台的地图 Layer 配置
 * 完全独立，不修改原有任何 Layer
 */

export interface EducationBrand {
  id: string;
  name: string;
  nameEn?: string;
  type: 'k12' | 'language' | '职业技能' | '考试培训' | 'STEAM' | '平台';
  city: string;
  province: string;
  country: string;
  lat: number;
  lon: number;
  founded: number;
  valuation?: string;
  users?: string;
  description?: string;
  website?: string;
}

export interface LiveStreamingPlatform {
  id: string;
  name: string;
  nameCn: string;
  type: '短视频社交' | '电商' | '知识付费' | '综合直播';
  country: string;
  hqLat: number;
  hqLon: number;
  activeStreams?: number;
  dailyUsers?: string;
  educationFocus: 'K12' | '职业教育' | '技能培训' | '语言学习' | '综合' | '全品类';
  description?: string;
}

export interface EducationLayer {
  id: string;
  name: string;
  nameCn: string;
  type: 'brand' | 'platform';
  category: string;
  data: EducationBrand[] | LiveStreamingPlatform[];
  color: string;
  icon?: string;
  description?: string;
}

/**
 * 中国在线教育品牌数据
 */
export const CHINA_EDU_BRANDS: EducationBrand[] = [
  // K12 教育
  {
    id: 'xdf',
    name: '新东方',
    nameEn: 'New Oriental',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9042,
    lon: 116.4074,
    founded: 1993,
    valuation: 'NASDAQ: EDU',
    users: '超5000万学员',
    description: '中国最大的综合性教育培训集团，业务涵盖K12、留学、语言培训等',
    website: 'https://www.xdf.cn'
  },
  {
    id: 'zsxdf',
    name: '北京新东方学校',
    nameEn: 'Beijing New Oriental School',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9149,
    lon: 116.4228,
    founded: 1993,
    description: '新东方集团旗舰学校'
  },
  {
    id: 'shxdf',
    name: '上海新东方学校',
    nameEn: 'Shanghai New Oriental School',
    type: 'k12',
    city: '上海',
    province: '上海市',
    country: 'China',
    lat: 31.2304,
    lon: 121.4737,
    founded: 1999,
    description: '新东方集团上海分校'
  },
  {
    id: 'gexdf',
    name: '广州新东方学校',
    nameEn: 'Guangzhou New Oriental School',
    type: 'k12',
    city: '广州',
    province: '广东省',
    country: 'China',
    lat: 23.1291,
    lon: 113.2644,
    founded: 2000,
    description: '新东方集团广州分校'
  },
  {
    id: 'sixdf',
    name: '深圳新东方学校',
    nameEn: 'Shenzhen New Oriental School',
    type: 'k12',
    city: '深圳',
    province: '广东省',
    country: 'China',
    lat: 22.5431,
    lon: 114.0579,
    founded: 2001,
    description: '新东方集团深圳分校'
  },
  {
    id: 'zjsxdf',
    name: '浙江新东方学校',
    nameEn: 'Zhejiang New Oriental School',
    type: 'k12',
    city: '杭州',
    province: '浙江省',
    country: 'China',
    lat: 30.2741,
    lon: 120.1551,
    founded: 2002,
    description: '新东方集团浙江分校'
  },
  {
    id: 'sxxdf',
    name: '四川新东方学校',
    nameEn: 'Sichuan New Oriental School',
    type: 'k12',
    city: '成都',
    province: '四川省',
    country: 'China',
    lat: 30.5728,
    lon: 104.0668,
    founded: 2003,
    description: '新东方集团四川分校'
  },
  {
    id: 'xjxdf',
    name: '武汉新东方学校',
    nameEn: 'Wuhan New Oriental School',
    type: 'k12',
    city: '武汉',
    province: '湖北省',
    country: 'China',
    lat: 30.5928,
    lon: 114.3055,
    founded: 2002,
    description: '新东方集团武汉分校'
  },
  {
    id: 'xes',
    name: '学而思',
    nameEn: 'TAL Education',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9149,
    lon: 116.4280,
    founded: 2003,
    valuation: 'NASDAQ: TAL',
    users: '超4000万学员',
    description: '中国领先的K12课外辅导机构，主打数理思维培养',
    website: 'https://www.17zuoye.com'
  },
  {
    id: 'bjxes',
    name: '北京学而思',
    nameEn: 'Beijing TAL Education',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9889,
    lon: 116.4760,
    founded: 2003,
    description: '学而思教育集团北京总部'
  },
  {
    id: 'shxes',
    name: '上海学而思',
    nameEn: 'Shanghai TAL Education',
    type: 'k12',
    city: '上海',
    province: '上海市',
    country: 'China',
    lat: 31.2304,
    lon: 121.4737,
    founded: 2007,
    description: '学而思教育集团上海分校'
  },
  {
    id: 'yfd',
    name: '猿辅导',
    nameEn: 'Yuanfudao',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9842,
    lon: 116.4790,
    founded: 2012,
    valuation: '超30亿美元',
    users: '超4亿用户',
    description: '中国最大的K12在线教育平台，提供直播课程和AI辅导',
    website: 'https://www.yuanfudao.com'
  },
  {
    id: 'gt',
    name: '高途',
    nameEn: 'Gaotu Techedu',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9649,
    lon: 116.4550,
    founded: 2014,
    valuation: 'NYSE: GOTU',
    users: '超5000万学员',
    description: '中国领先的在线教育机构，提供K12和职业教育课程',
    website: 'https://www.gaotu.com'
  },
  {
    id: 'zyb',
    name: '作业帮',
    nameEn: 'Zuoyebang',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9742,
    lon: 116.4690,
    founded: 2014,
    valuation: '超17亿美元',
    users: '超8亿用户',
    description: '中国最大的K12智能学习平台，提供拍照搜题和直播课程',
    website: 'https://www.zuoyebang.com'
  },
  {
    id: 'hhx',
    name: '火花思维',
    nameEn: 'Spark Education',
    type: 'STEAM',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9542,
    lon: 116.4600,
    founded: 2017,
    valuation: '超15亿美元',
    users: '超50万在读学员',
    description: '专注于3-12岁儿童数理思维培养的在线教育平台',
    website: 'https://www.huohua.cn'
  },
  {
    id: 'dsx',
    name: '大鹏教育',
    nameEn: 'Dapeng Education',
    type: '职业技能',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9442,
    lon: 116.4500,
    founded: 2015,
    description: '专注于成年人技能培训的在线教育平台'
  },
  {
    id: 'yzx',
    name: '有赞教育',
    nameEn: 'Youzan Education',
    type: '平台',
    city: '杭州',
    province: '浙江省',
    country: 'China',
    lat: 30.2741,
    lon: 120.1551,
    founded: 2018,
    description: '有赞旗下的教育行业解决方案平台'
  },
  {
    id: 'bx',
    name: '编程猫',
    nameEn: 'Coding Cat',
    type: 'STEAM',
    city: '深圳',
    province: '广东省',
    country: 'China',
    lat: 22.5431,
    lon: 114.0579,
    founded: 2015,
    valuation: '超20亿人民币',
    description: '专注于4-16岁青少年编程教育的在线平台'
  },
  {
    id: 'lw',
    name: '流利说',
    nameEn: 'LAIX',
    type: '语言',
    city: '上海',
    province: '上海市',
    country: 'China',
    lat: 31.2304,
    lon: 121.4737,
    founded: 2012,
    valuation: 'NYSE: LAIX',
    description: '中国领先的AI英语学习平台'
  },
  {
    id: 'xz',
    name: '小站教育',
    nameEn: 'Xiaozhan Education',
    type: '考试培训',
    city: '上海',
    province: '上海市',
    country: 'China',
    lat: 31.2004,
    lon: 121.4600,
    founded: 2011,
    description: '专注于留学考试培训的在线教育平台'
  },
  {
    id: 'mf',
    name: '魔法校',
    nameEn: 'Magic School',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9342,
    lon: 116.4400,
    founded: 2018,
    description: '好未来旗下中小学在线一对一辅导平台'
  },
  {
    id: 'zy',
    name: '掌门1对1',
    nameEn: 'Zhangmen Mentor',
    type: 'k12',
    city: '上海',
    province: '上海市',
    country: 'China',
    lat: 31.1804,
    lon: 121.4000,
    founded: 2005,
    valuation: '超10亿美元',
    description: '中国最大的K12在线一对一教育平台'
  },
  {
    id: 'ai',
    name: 'AI双师',
    nameEn: 'AI Double Teacher',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9242,
    lon: 116.4300,
    founded: 2019,
    description: 'AI辅助教学的在线教育平台'
  },
  {
    id: 'hwh',
    name: '华罗庚网校',
    nameEn: 'Hua Luogeng Online School',
    type: 'k12',
    city: '北京',
    province: '北京市',
    country: 'China',
    lat: 39.9142,
    lon: 116.4200,
    founded: 2020,
    description: '专注于数学奥赛的在线教育平台'
  }
];

/**
 * 中国直播平台教育相关数据
 */
export const CHINA_LIVE_PLATFORMS: LiveStreamingPlatform[] = [
  {
    id: 'xhs',
    name: 'Xiaohongshu',
    nameCn: '小红书',
    type: '短视频社交',
    country: 'China',
    hqLat: 31.2304,
    hqLon: 121.4737,
    activeStreams: 100000,
    dailyUsers: '超2亿',
    educationFocus: '综合',
    description: '中国领先的生活方式分享平台，教育内容增长迅速'
  },
  {
    id: 'ks',
    name: 'Kuaishou',
    nameCn: '快手',
    type: '短视频社交',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 200000,
    dailyUsers: '超3亿',
    educationFocus: '综合',
    description: '中国第二大短视频平台，教育直播覆盖K12和职业技能'
  },
  {
    id: 'dy',
    name: 'Douyin',
    nameCn: '抖音',
    type: '短视频社交',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 500000,
    dailyUsers: '超7亿',
    educationFocus: '全品类',
    description: '中国最大的短视频平台，教育内容生态完善'
  },
  {
    id: 'tb',
    name: 'Taobao Live',
    nameCn: '淘宝直播',
    type: '电商',
    country: 'China',
    hqLat: 30.2741,
    hqLon: 120.1551,
    activeStreams: 80000,
    dailyUsers: '超1亿',
    educationFocus: '职业技能',
    description: '阿里巴巴旗下电商直播平台，职业教育内容丰富'
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    nameCn: '哔哩哔哩',
    type: '综合直播',
    country: 'China',
    hqLat: 31.2004,
    hqLon: 121.4600,
    activeStreams: 30000,
    dailyUsers: '超9000万',
    educationFocus: '综合',
    description: '中国领先的视频社区，学习类内容是核心品类之一'
  },
  {
    id: 'wx',
    name: 'WeChat Channels',
    nameCn: '微信视频号',
    type: '综合直播',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 150000,
    dailyUsers: '超4亿',
    educationFocus: '综合',
    description: '微信生态内的短视频直播平台，教育内容增长迅速'
  },
  {
    id: 'baidu',
    name: 'Baidu Live',
    nameCn: '百度直播',
    type: '综合直播',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 20000,
    dailyUsers: '超5000万',
    educationFocus: '职业教育',
    description: '百度旗下直播平台，知识付费和教育内容丰富'
  },
  {
    id: 'wb',
    name: 'Weibo Live',
    nameCn: '微博直播',
    type: '短视频社交',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 10000,
    dailyUsers: '超2亿',
    educationFocus: '综合',
    description: '微博平台直播功能，名人教育直播活跃'
  },
  {
    id: 'zhihu',
    name: 'Zhihu Live',
    nameCn: '知乎直播',
    type: '知识付费',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 5000,
    dailyUsers: '超5000万',
    educationFocus: '综合',
    description: '知乎平台直播功能，专业知识分享为主'
  },
  {
    id: 'inke',
    name: 'Inke',
    nameCn: '映客直播',
    type: '综合直播',
    country: 'China',
    hqLat: 39.9042,
    hqLon: 116.4074,
    activeStreams: 8000,
    dailyUsers: '超2000万',
    educationFocus: '语言学习',
    description: '映客旗下直播平台，语言学习直播活跃'
  }
];

/**
 * 教育相关地图 Layer 配置数组
 */
export const educationLayers: EducationLayer[] = [
  {
    id: 'china-edu-brands',
    name: 'China Education Brands',
    nameCn: '中国教育品牌',
    type: 'brand',
    category: 'Education',
    data: CHINA_EDU_BRANDS,
    color: '#FF6B6B',
    icon: 'school',
    description: '中国在线教育品牌分布（新东方、学而思、猿辅导等）'
  },
  {
    id: 'china-live-streaming',
    name: 'China Live Streaming Platforms',
    nameCn: '中国直播平台',
    type: 'platform',
    category: 'Education',
    data: CHINA_LIVE_PLATFORMS,
    color: '#4ECDC4',
    icon: 'videocam',
    description: '中国直播平台教育信号（抖音、快手、小红书、B站等）'
  }
];

/**
 * 获取教育品牌数据
 */
export function getEducationBrands(): EducationBrand[] {
  return CHINA_EDU_BRANDS;
}

/**
 * 获取直播平台数据
 */
export function getLivePlatforms(): LiveStreamingPlatform[] {
  return CHINA_LIVE_PLATFORMS;
}

/**
 * 根据ID获取教育品牌
 */
export function getBrandById(id: string): EducationBrand | undefined {
  return CHINA_EDU_BRANDS.find(brand => brand.id === id);
}

/**
 * 根据类型筛选教育品牌
 */
export function getBrandsByType(type: EducationBrand['type']): EducationBrand[] {
  return CHINA_EDU_BRANDS.filter(brand => brand.type === type);
}

/**
 * 获取所有教育 Layer
 */
export function getEducationLayers(): EducationLayer[] {
  return educationLayers;
}
