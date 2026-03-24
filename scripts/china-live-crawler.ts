/**
 * China Live Streaming Education Signal Crawler
 *
 * 抓取小红书、快手、淘宝、B站、微信视频号等平台的教育直播信号
 * 支持 cron 定时任务或手动运行
 *
 * 使用方法:
 *   npx ts-node scripts/china-live-crawler.ts
 *   或配置 cron: npx ts-node scripts/china-live-crawler.ts --cron
 *
 * 环境变量:
 *   API_KEY - 平台API密钥（如需要）
 *   OUTPUT_DIR - 输出目录，默认 ./data/live-signals
 */

import * as fs from 'fs';
import * as path from 'path';

// ============== 配置 ==============

interface CrawlerConfig {
  outputDir: string;
  platforms: string[];
  educationKeywords: string[];
  signalThreshold: number;
}

const DEFAULT_CONFIG: CrawlerConfig = {
  outputDir: './data/live-signals',
  platforms: ['xiaohongshu', 'kuaishou', 'taobao', 'bilibili', 'wechat', 'baidu', 'weibo', 'douyin'],
  educationKeywords: [
    '数学', '英语', '语文', '物理', '化学', '生物', '历史', '地理', '政治',
    'K12', '高考', '中考', '考研', '公务员', '编程', 'Python', 'AI',
    '职业技能', '电商运营', '新媒体', '设计', '摄影', '理财',
    '雅思', '托福', 'GRE', 'GMAT', '留学'
  ],
  signalThreshold: 0.6 // 信号强度阈值 0-1
};

// ============== 类型定义 ==============

interface LiveStreamSignal {
  id: string;
  platform: string;
  platformCn: string;
  title: string;
  streamer: string;
  followers?: string;
  category: string;
  subCategory?: string;
  timestamp: string;
  location?: {
    country: string;
    province?: string;
    city?: string;
  };
  metrics: {
    viewers?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  signalStrength: number; // 0-1
  educationLevel?: '幼儿园' | '小学' | '初中' | '高中' | '大学' | '成人' | '全年龄';
  subject?: string;
  tags: string[];
  isLive: boolean;
  url?: string;
}

interface CrawlerResult {
  timestamp: string;
  platform: string;
  success: boolean;
  signalCount: number;
  signals: LiveStreamSignal[];
  error?: string;
}

interface AggregateSignal {
  platform: string;
  platformCn: string;
  totalStreams: number;
  totalViewers: number;
  avgSignalStrength: number;
  dominantCategory: string;
  educationLevel: string;
  topSubjects: string[];
  peakTime?: string;
  geographicDistribution?: {
    region: string;
    count: number;
  }[];
}

// ============== 平台配置 ==============

const PLATFORM_CONFIG = {
  xiaohongshu: {
    name: 'Xiaohongshu',
    nameCn: '小红书',
    apiEndpoint: 'https://api.xiaohongshu.com',
    searchEndpoint: '/api/sns/v3/search/notes'
  },
  kuaishou: {
    name: 'Kuaishou',
    nameCn: '快手',
    apiEndpoint: 'https://api.kuaishou.com',
    searchEndpoint: '/api/rest/v3/search/live'
  },
  taobao: {
    name: 'Taobao Live',
    nameCn: '淘宝直播',
    apiEndpoint: 'https://api.taobao.com',
    searchEndpoint: '/router/rest'
  },
  bilibili: {
    name: 'Bilibili',
    nameCn: '哔哩哔哩',
    apiEndpoint: 'https://api.bilibili.com',
    searchEndpoint: '/x/web-interface/search/type'
  },
  wechat: {
    name: 'WeChat Channels',
    nameCn: '微信视频号',
    apiEndpoint: 'https://api.weixin.qq.com',
    searchEndpoint: '/cgi-bin/express/material/search'
  },
  baidu: {
    name: 'Baidu Live',
    nameCn: '百度直播',
    apiEndpoint: 'https://api.baidu.com',
    searchEndpoint: '/json/live/v1/search'
  },
  weibo: {
    name: 'Weibo Live',
    nameCn: '微博直播',
    apiEndpoint: 'https://api.weibo.com',
    searchEndpoint: '/2/search/statuses'
  },
  douyin: {
    name: 'Douyin',
    nameCn: '抖音',
    apiEndpoint: 'https://open.douyin.com',
    searchEndpoint: '/api/douyin/v1/search/video'
  }
};

// ============== 核心爬虫逻辑 ==============

/**
 * 主爬虫类
 */
class ChinaLiveCrawler {
  private config: CrawlerConfig;
  private results: Map<string, CrawlerResult[]> = new Map();

  constructor(config: Partial<CrawlerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ensureOutputDir();
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDir(): void {
    const outputPath = path.resolve(this.config.outputDir);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(platform: string, seed: string): string {
    const timestamp = Date.now().toString(36);
    const hash = Buffer.from(`${platform}-${seed}-${timestamp}`)
      .toString('base64')
      .replace(/[/+=]/g, '')
      .substring(0, 8);
    return `${platform}-${hash}`;
  }

  /**
   * 计算教育信号强度
   */
  private calculateSignalStrength(title: string, tags: string[]): number {
    const content = `${title} ${tags.join(' ')}`.toLowerCase();
    let score = 0;

    // 关键词匹配计分
    for (const keyword of this.config.educationKeywords) {
      if (content.includes(keyword.toLowerCase())) {
        score += 0.15;
      }
    }

    // 归一化到 0-1
    return Math.min(score, 1);
  }

  /**
   * 识别教育类别
   */
  private categorizeEducation(title: string, tags: string[]): { category: string; level?: string; subject?: string } {
    const content = `${title} ${tags.join(' ')}`;

    // K12 相关
    if (/小学|初中|高中|中考|高考|K12|同步课|预习/.test(content)) {
      if (/数学|奥数/.test(content)) return { category: 'K12-数理', level: '全年龄', subject: '数学' };
      if (/英语|口语|语法/.test(content)) return { category: 'K12-英语', level: '全年龄', subject: '英语' };
      if (/语文|作文|阅读/.test(content)) return { category: 'K12-语文', level: '全年龄', subject: '语文' };
      return { category: 'K12', level: '全年龄' };
    }

    // 职业教育
    if (/电商|运营|新媒体|直播带货|选品/.test(content)) {
      return { category: '职业教育-电商', level: '成人' };
    }
    if (/编程|开发|前端|后端|Python|Java|AI|机器学习/.test(content)) {
      return { category: '职业教育-IT', level: '成人', subject: '编程' };
    }
    if /设计|PS|AE|PR|C4D|UI/.test(content)) {
      return { category: '职业教育-设计', level: '成人' };
    }
    if /考证|会计|建造师|消防|执业药师/.test(content)) {
      return { category: '职业教育-考证', level: '成人' };
    }

    // 语言学习
    if /雅思|托福|GRE|GMAT|留学/.test(content)) {
      return { category: '语言学习-留学', level: '成人', subject: '英语' };
    }
    if /口语|听力|发音|零基础/.test(content)) {
      return { category: '语言学习', level: '成人' };
    }

    // 考试培训
    if /考研|考公|事业单位|教师资格/.test(content)) {
      return { category: '考试培训', level: '成人' };
    }

    // STEAM教育
    if /编程|机器人|科学|实验|创客/.test(content)) {
      return { category: 'STEAM', level: '全年龄', subject: '科学' };
    }

    return { category: '综合教育' };
  }

  /**
   * 模拟爬取单个平台数据
   * 注意：实际生产环境需要替换为真实API调用
   */
  private async crawlPlatform(platform: string): Promise<CrawlerResult> {
    const platformConfig = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
    const timestamp = new Date().toISOString();

    console.log(`\n[${timestamp}] 开始爬取 ${platformConfig.nameCn} (${platformConfig.name})...`);

    try {
      // 模拟数据 - 实际使用时请替换为真实API调用
      const mockSignals = this.generateMockSignals(platform, platformConfig);

      // 过滤低于阈值的信号
      const filteredSignals = mockSignals.filter(s => s.signalStrength >= this.config.signalThreshold);

      const result: CrawlerResult = {
        timestamp,
        platform,
        success: true,
        signalCount: filteredSignals.length,
        signals: filteredSignals
      };

      console.log(`[${platformConfig.nameCn}] 成功获取 ${filteredSignals.length} 条教育直播信号`);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[${platformConfig.nameCn}] 爬取失败: ${errorMessage}`);

      return {
        timestamp,
        platform,
        success: false,
        signalCount: 0,
        signals: [],
        error: errorMessage
      };
    }
  }

  /**
   * 生成模拟信号数据
   * 实际使用时替换为真实API调用
   */
  private generateMockSignals(platform: string, config: typeof PLATFORM_CONFIG.douyin): LiveStreamSignal[] {
    const mockTitles = [
      '高考数学冲刺班 - 今晚8点开课',
      '零基础学Python编程',
      '考研英语写作技巧分享',
      '小学数学思维训练',
      '电商直播带货实战课',
      '雅思口语模拟练习',
      '初中物理实验演示',
      '新媒体运营入门指南',
      '高中化学重点讲解',
      '职业资格证考试辅导'
    ];

    const streamers = [
      '李老师数学课堂', '王老师英语屋', '张老师编程课',
      '刘老师高考冲刺', '陈老师电商讲堂', '周老师设计工坊',
      '清华学长带你学', '北大名师课堂', '名师在线教育'
    ];

    const signals: LiveStreamSignal[] = [];
    const count = Math.floor(Math.random() * 15) + 5; // 5-20条信号

    for (let i = 0; i < count; i++) {
      const title = mockTitles[Math.floor(Math.random() * mockTitles.length)];
      const streamer = streamers[Math.floor(Math.random() * streamers.length)];
      const tags = this.config.educationKeywords
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 5) + 2);

      const categorization = this.categorizeEducation(title, tags);
      const signalStrength = this.calculateSignalStrength(title, tags);

      const signal: LiveStreamSignal = {
        id: this.generateId(platform, `${title}-${i}`),
        platform: config.name,
        platformCn: config.nameCn,
        title,
        streamer,
        followers: `${Math.floor(Math.random() * 100)}万`,
        category: categorization.category,
        subCategory: categorization.subject,
        timestamp: new Date().toISOString(),
        location: {
          country: 'China',
          province: ['北京', '上海', '广东', '浙江', '江苏', '四川'][Math.floor(Math.random() * 6)],
          city: ['北京', '上海', '广州', '深圳', '杭州', '成都'][Math.floor(Math.random() * 6)]
        },
        metrics: {
          viewers: Math.floor(Math.random() * 10000) + 100,
          likes: Math.floor(Math.random() * 5000) + 50,
          comments: Math.floor(Math.random() * 500) + 10,
          shares: Math.floor(Math.random() * 200) + 5
        },
        signalStrength,
        educationLevel: categorization.level as LiveStreamSignal['educationLevel'],
        subject: categorization.subject,
        tags,
        isLive: Math.random() > 0.3,
        url: `https://${platform}.com/live/${Math.random().toString(36).substring(7)}`
      };

      signals.push(signal);
    }

    return signals;
  }

  /**
   * 爬取所有平台
   */
  async crawlAll(): Promise<void> {
    console.log('='.repeat(50));
    console.log('中国教育直播信号爬虫启动');
    console.log(`时间: ${new Date().toISOString()}`);
    console.log(`目标平台: ${this.config.platforms.join(', ')}`);
    console.log('='.repeat(50));

    for (const platform of this.config.platforms) {
      const result = await this.crawlPlatform(platform);

      if (!this.results.has(platform)) {
        this.results.set(platform, []);
      }
      this.results.get(platform)!.push(result);
    }

    console.log('\n' + '='.repeat(50));
    console.log('爬取完成！');
    console.log('='.repeat(50));
  }

  /**
   * 生成聚合报告
   */
  generateAggregateReport(): AggregateSignal[] {
    const report: AggregateSignal[] = [];

    for (const platform of this.config.platforms) {
      const results = this.results.get(platform) || [];
      const latestResults = results.slice(-10); // 最近10次

      if (latestResults.length === 0) continue;

      const platformConfig = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
      const allSignals = latestResults.flatMap(r => r.signals);

      if (allSignals.length === 0) continue;

      const categoryCount: Record<string, number> = {};
      const levelCount: Record<string, number> = {};
      const subjectCount: Record<string, number> = {};

      for (const signal of allSignals) {
        categoryCount[signal.category] = (categoryCount[signal.category] || 0) + 1;
        if (signal.educationLevel) {
          levelCount[signal.educationLevel] = (levelCount[signal.educationLevel] || 0) + 1;
        }
        if (signal.subject) {
          subjectCount[signal.subject] = (subjectCount[signal.subject] || 0) + 1;
        }
      }

      const dominantCategory = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

      const dominantLevel = Object.entries(levelCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

      const topSubjects = Object.entries(subjectCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([s]) => s);

      report.push({
        platform: platformConfig.name,
        platformCn: platformConfig.nameCn,
        totalStreams: allSignals.length,
        totalViewers: allSignals.reduce((sum, s) => sum + (s.metrics.viewers || 0), 0),
        avgSignalStrength: allSignals.reduce((sum, s) => sum + s.signalStrength, 0) / allSignals.length,
        dominantCategory,
        educationLevel: dominantLevel,
        topSubjects
      });
    }

    return report;
  }

  /**
   * 保存结果到文件
   */
  saveResults(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.resolve(this.config.outputDir);

    // 保存详细信号数据
    for (const [platform, results] of this.results) {
      const filename = `${outputDir}/${platform}-${timestamp}.json`;
      fs.writeFileSync(filename, JSON.stringify({
        platform,
        timestamp,
        results
      }, null, 2), 'utf-8');
      console.log(`已保存: ${filename}`);
    }

    // 保存聚合报告
    const aggregateReport = this.generateAggregateReport();
    const aggregateFilename = `${outputDir}/aggregate-${timestamp}.json`;
    fs.writeFileSync(aggregateFilename, JSON.stringify({
      timestamp,
      report: aggregateReport
    }, null, 2), 'utf-8');
    console.log(`已保存聚合报告: ${aggregateFilename}`);

    // 保存最新数据链接
    const latestLink = `${outputDir}/latest-${timestamp.split('T')[0]}.json`;
    fs.writeFileSync(latestLink, JSON.stringify({
      timestamp,
      platforms: Array.from(this.results.keys())
    }, null, 2), 'utf-8');
    console.log(`已保存最新链接: ${latestLink}`);
  }

  /**
   * 打印报告到控制台
   */
  printReport(): void {
    console.log('\n' + '='.repeat(50));
    console.log('教育直播信号聚合报告');
    console.log('='.repeat(50));

    const report = this.generateAggregateReport();

    for (const item of report) {
      console.log(`\n【${item.platformCn} (${item.platform})】`);
      console.log(`  教育直播数: ${item.totalStreams}`);
      console.log(`  总观看人数: ${item.totalViewers.toLocaleString()}`);
      console.log(`  平均信号强度: ${(item.avgSignalStrength * 100).toFixed(1)}%`);
      console.log(`  主要类别: ${item.dominantCategory}`);
      console.log(`  教育阶段: ${item.educationLevel}`);
      if (item.topSubjects.length > 0) {
        console.log(`  热门学科: ${item.topSubjects.join(', ')}`);
      }
    }

    console.log('\n' + '='.repeat(50));
  }
}

// ============== 主程序入口 ==============

async function main() {
  const args = process.argv.slice(2);
  const isCron = args.includes('--cron');
  const isReport = args.includes('--report');

  const crawler = new ChinaLiveCrawler();

  if (isCron) {
    console.log('运行模式: Cron 定时任务');
    // Cron模式下静默运行，只保存结果
    await crawler.crawlAll();
    crawler.saveResults();
  } else if (isReport) {
    console.log('运行模式: 报告查看');
    // 报告模式只打印最新结果
    crawler.printReport();
  } else {
    // 默认模式：爬取并显示报告
    await crawler.crawlAll();
    crawler.printReport();
    crawler.saveResults();
  }

  console.log('\n完成！');
}

// 运行
main().catch(console.error);

// 导出类供外部使用
export { ChinaLiveCrawler, LiveStreamSignal, CrawlerResult, AggregateSignal };
