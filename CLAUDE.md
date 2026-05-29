# Claude Code 项目规则

本文件定义模型在此项目中的行为规则，模型应**主动调用**相应技能。
我需要的是质量，不需要在意 token 消耗

---

## 语言偏好（Language）

**所有输出必须使用中文，包括但不限于：**

- **思维过程（thinking/reasoning）**：使用中文
- **工具描述和调用说明**：使用中文
- **错误信息、警告、状态更新**：使用中文
- **代码注释**：使用中文（除非技术原因必须用英文，如变量名、API 标识符）
- **生成的文档、PR 描述、提交信息**：使用中文

**例外情况**：
- 代码中的变量名、函数名、类名等标识符保持英文
- 技术术语如果英文更常用（如 API、PRD、CRO），可使用英文
- 与外部系统交互的固定格式内容（如 JSON key、HTTP header）保持英文

---

## Skills 目录结构

```
skills/
├── marketing/      (40个) ← 营销、SEO、广告、内容
├── engineering/    (10个) ← 代码架构、调试、Issue
├── product/        (6个)  ← PRD、周报、数据分析
├── developer/      (10个) ← 开发流程、评审、分支
├── basic/          (3个)  ← 代理调度、技能编写
├── personal/       (2个)  ← 文章编辑、Obsidian
├── productivity/   (4个)  ← 效率工具、交接
├── misc/           (4个)  ← Git钩子、配置
├── deprecated/     (4个)  ← 已弃用
└── in-progress/    (4个)  ← 开发中
```

---

## Skills 调用方式（重要）

所有自定义 Skill 通过 `Read` 工具读取对应 `SKILL.md` 文件后执行。

#### Product 产品类
| Skill | 路径 |
|-------|------|
| prd-generator | `skills/product/prd-generator/SKILL.md` |
| UserManual-Generator | `skills/product/UserManual-Generator/SKILL.md` |
| WeeklyReportGenerator | `skills/product/WeeklyReportGenerator/SKILL.md` |
| data-researcher | `skills/product/data-researcher/SKILL.md` |
| industry-analyst | `skills/product/industry-analyst/SKILL.md` |
| brainstorming | `skills/product/brainstorming/SKILL.md` |

#### Marketing 营销类（40个）
| Skill | 路径 |
|-------|------|
| copywriting | `skills/marketing/copywriting/SKILL.md` |
| copy-editing | `skills/marketing/copy-editing/SKILL.md` |
| seo-audit | `skills/marketing/seo-audit/SKILL.md` |
| ai-seo | `skills/marketing/ai-seo/SKILL.md` |
| programmatic-seo | `skills/marketing/programmatic-seo/SKILL.md` |
| cro | `skills/marketing/cro/SKILL.md` |
| ads | `skills/marketing/ads/SKILL.md` |
| ad-creative | `skills/marketing/ad-creative/SKILL.md` |
| ab-testing | `skills/marketing/ab-testing/SKILL.md` |
| analytics | `skills/marketing/analytics/SKILL.md` |
| social | `skills/marketing/social/SKILL.md` |
| emails | `skills/marketing/emails/SKILL.md` |
| cold-email | `skills/marketing/cold-email/SKILL.md` |
| launch | `skills/marketing/launch/SKILL.md` |
| pricing | `skills/marketing/pricing/SKILL.md` |
| paywalls | `skills/marketing/paywalls/SKILL.md` |
| signup | `skills/marketing/signup/SKILL.md` |
| onboarding | `skills/marketing/onboarding/SKILL.md` |
| churn-prevention | `skills/marketing/churn-prevention/SKILL.md` |
| referrals | `skills/marketing/referrals/SKILL.md` |
| content-strategy | `skills/marketing/content-strategy/SKILL.md` |
| lead-magnets | `skills/marketing/lead-magnets/SKILL.md` |
| free-tools | `skills/marketing/free-tools/SKILL.md` |
| customer-research | `skills/marketing/customer-research/SKILL.md` |
| competitors | `skills/marketing/competitors/SKILL.md` |
| competitor-profiling | `skills/marketing/competitor-profiling/SKILL.md` |
| product-marketing | `skills/marketing/product-marketing/SKILL.md` |
| sales-enablement | `skills/marketing/sales-enablement/SKILL.md` |
| directory-submissions | `skills/marketing/directory-submissions/SKILL.md` |
| schema | `skills/marketing/schema/SKILL.md` |
| site-architecture | `skills/marketing/site-architecture/SKILL.md` |
| popups | `skills/marketing/popups/SKILL.md` |
| community-marketing | `skills/marketing/community-marketing/SKILL.md` |
| co-marketing | `skills/marketing/co-marketing/SKILL.md` |
| marketing-psychology | `skills/marketing/marketing-psychology/SKILL.md` |
| revops | `skills/marketing/revops/SKILL.md` |
| aso | `skills/marketing/aso/SKILL.md` |
| marketing-ideas | `skills/marketing/marketing-ideas/SKILL.md` |
| image | `skills/marketing/image/SKILL.md` |
| video | `skills/marketing/video/SKILL.md` |

#### Engineering 工程类（10个）
| Skill | 路径 |
|-------|------|
| diagnose | `skills/engineering/diagnose/SKILL.md` |
| improve-codebase-architecture | `skills/engineering/improve-codebase-architecture/SKILL.md` |
| prototype | `skills/engineering/prototype/SKILL.md` |
| tdd | `skills/engineering/tdd/SKILL.md` |
| to-issues | `skills/engineering/to-issues/SKILL.md` |
| to-prd | `skills/engineering/to-prd/SKILL.md` |
| triage | `skills/engineering/triage/SKILL.md` |
| zoom-out | `skills/engineering/zoom-out/SKILL.md` |
| grill-with-docs | `skills/engineering/grill-with-docs/SKILL.md` |
| setup-matt-pocock-skills | `skills/engineering/setup-matt-pocock-skills/SKILL.md` |

#### Developer 开发类（10个）
| Skill | 路径 |
|-------|------|
| test-driven-development | `skills/developer/test-driven-development/SKILL.md` |
| systematic-debugging | `skills/developer/systematic-debugging/SKILL.md` |
| executing-plans | `skills/developer/executing-plans/SKILL.md` |
| finishing-a-development-branch | `skills/developer/finishing-a-development-branch/SKILL.md` |
| requesting-code-review | `skills/developer/requesting-code-review/SKILL.md` |
| receiving-code-review | `skills/developer/receiving-code-review/SKILL.md` |
| subagent-driven-development | `skills/developer/subagent-driven-development/SKILL.md` |
| using-git-worktrees | `skills/developer/using-git-worktrees/SKILL.md` |
| verification-before-completion | `skills/developer/verification-before-completion/SKILL.md` |
| writing-plans | `skills/developer/writing-plans/SKILL.md` |

#### Basic 基础类（3个）
| Skill | 路径 |
|-------|------|
| dispatching-parallel-agents | `skills/basic/dispatching-parallel-agents/SKILL.md` |
| writing-skills | `skills/basic/writing-skills/SKILL.md` |
| using-superpowers | `skills/basic/using-superpowers/SKILL.md` |

#### Personal 个人类（2个）
| Skill | 路径 |
|-------|------|
| edit-article | `skills/personal/edit-article/SKILL.md` |
| obsidian-vault | `skills/personal/obsidian-vault/SKILL.md` |

#### Productivity 效率类（4个）
| Skill | 路径 |
|-------|------|
| grill-me | `skills/productivity/grill-me/SKILL.md` |
| handoff | `skills/productivity/handoff/SKILL.md` |
| write-a-skill | `skills/productivity/write-a-skill/SKILL.md` |
| caveman | `skills/productivity/caveman/SKILL.md` |

#### Misc 杂项（4个）
| Skill | 路径 |
|-------|------|
| git-guardrails-claude-code | `skills/misc/git-guardrails-claude-code/SKILL.md` |
| migrate-to-shoehorn | `skills/misc/migrate-to-shoehorn/SKILL.md` |
| scaffold-exercises | `skills/misc/scaffold-exercises/SKILL.md` |
| setup-pre-commit | `skills/misc/setup-pre-commit/SKILL.md` |

---

## 快速关键词匹配表

| 任务关键词 | Skill | 分类 |
|------------|-------|------|
| PRD、需求文档 | prd-generator | product |
| 周报、汇报 | WeeklyReportGenerator | product |
| 数据分析、报表 | data-researcher | product |
| 头脑风暴、创意 | brainstorming | product |
| 文案、营销文案 | copywriting | marketing |
| SEO、排名优化 | seo-audit | marketing |
| 转化率、CRO | cro | marketing |
| 广告、投放 | ads | marketing |
| 调试、Bug | diagnose | engineering |
| TDD、测试驱动 | tdd / test-driven-development | engineering/developer |
| 架构优化、重构 | improve-codebase-architecture | engineering |
| 执行计划 | executing-plans | developer |
| 代码评审 | review | built-in skill |
| 批量文件 | batch | built-in skill |
| 循环任务 | loop | built-in skill |
| 创建技能 | writing-skills / write-a-skill | basic/productivity |

---

## 强制规则

### HARD-GATE: 技能发现优先

**任何任务开始前，必须先检查是否有适用的技能：**

❌ **错误做法：** 直接开始回答或执行

✅ **正确做法：**
1. 判断场景是否匹配某个 skill（参考关键词匹配表）
2. 内置 skills（review/loop/batch）→ 使用 `skill` tool 调用
3. 自定义 skills → 使用 `Read` 工具读取对应分类下的 SKILL.md
4. 严格遵循 skill 内容执行
5. 了解项目情况：`basic/` 目录包含当前项目的页面、需求文档等
6. 学习用户习惯：错误需要记录到复盘文档防止重复

**常见的自我欺骗想法（必须停止）：**
| 想法 | 现实 |
|------|------|
| "这只是个简单问题" | 问题也需要技能来指导 |
| "我需要先收集上下文" | 技能会告诉你如何收集 |
| "我先快速看看文件" | 技能会指导你如何看 |
| "这个不需要正式技能" | 如果技能存在，就用它 |

---

### 用户指令优先级

用户指令始终高于技能默认行为：

1. 用户明确指令（CLAUDE.md、直接请求）— 最高优先级
2. 技能规范 — 覆盖默认系统行为
3. 默认系统提示 — 最低优先级
