import { memo } from "react";
import { ARTWORK_ALT, IMAGES } from "../data/images";
import type { Story } from "../data/stories";
import { useSite } from "./siteContext";
import { Lines } from "./ui";

/**
 * Editorial card. Case-study cards carry `data-asset`, which tells the engine to swap the image
 * for an interactive 3D collectible, so they must not re-render once mounted (the engine adds
 * its own nodes inside). `memo` keeps them stable.
 */
export const StoryCard = memo(function StoryCard({ story, asset }: { story: Story; asset: boolean }) {
  const site = useSite();
  return (
    <article className="story-card">
      <span className="story-meta">{story.meta}</span>
      <button aria-label={`Read ${story.summary}`} onClick={() => site.story(story)}>
        <div className="story-image" data-artwork={story.art} data-asset={asset ? story.art : undefined}>
          <img src={IMAGES[story.art]} alt={ARTWORK_ALT[story.art]} width={1536} height={1024} loading="lazy" />
          <span>
            <Lines text={story.title} />
          </span>
        </div>
        <h3>{story.summary}</h3>
      </button>
    </article>
  );
});
