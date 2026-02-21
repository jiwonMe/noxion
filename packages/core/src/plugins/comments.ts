import type { NoxionPlugin, HeadTag } from "../plugin";

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: string;
  theme?: string;
}

export interface UtterancesConfig {
  repo: string;
  issueTerm?: string;
  theme?: string;
}

export interface DisqusConfig {
  shortname: string;
}

export interface CommentsPluginOptions {
  provider: "giscus" | "utterances" | "disqus";
  config: GiscusConfig | UtterancesConfig | DisqusConfig;
}

export function createCommentsPlugin(options: CommentsPluginOptions): NoxionPlugin {
  return {
    name: "noxion-plugin-comments",
    injectHead: () => generateCommentsTags(options),
  };
}

function generateCommentsTags(options: CommentsPluginOptions): HeadTag[] {
  switch (options.provider) {
    case "giscus": {
      const cfg = options.config as GiscusConfig;
      return [
        {
          tagName: "script",
          attributes: {
            src: "https://giscus.app/client.js",
            "data-repo": cfg.repo,
            "data-repo-id": cfg.repoId,
            "data-category": cfg.category,
            "data-category-id": cfg.categoryId,
            "data-mapping": cfg.mapping ?? "pathname",
            "data-theme": cfg.theme ?? "preferred_color_scheme",
            crossorigin: "anonymous",
            async: "true",
          },
        },
      ];
    }

    case "utterances": {
      const cfg = options.config as UtterancesConfig;
      return [
        {
          tagName: "script",
          attributes: {
            src: "https://utteranc.es/client.js",
            repo: cfg.repo,
            "issue-term": cfg.issueTerm ?? "pathname",
            theme: cfg.theme ?? "github-light",
            crossorigin: "anonymous",
            async: "true",
          },
        },
      ];
    }

    case "disqus": {
      const cfg = options.config as DisqusConfig;
      return [
        {
          tagName: "script",
          innerHTML: `var disqus_config=function(){this.page.url=window.location.href;this.page.identifier=window.location.pathname;};(function(){var d=document,s=d.createElement('script');s.src='https://${cfg.shortname}.disqus.com/embed.js';s.setAttribute('data-timestamp',+new Date());(d.head||d.body).appendChild(s);})();`,
        },
      ];
    }
  }
}
