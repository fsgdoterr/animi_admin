import type { DubType } from "~/lib/constants/dub-type";
import type { VideoSourceType } from "~/lib/constants/video-source-type";
import type { Player } from "~/lib/types/entities/player-type";
import type { ReleaseTeam } from "~/lib/types/entities/release-team-type";

export interface EpisodeVariant {
    id: number;
    type: DubType;
    sourceType: VideoSourceType;
    endpoint: string;
    releaseTeam: ReleaseTeam;
    player: Player;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Episode {
    id: number;
    title: string | null;
    number: number;
    variants: EpisodeVariant[];

    createdAt: string;
    updatedAt: string;
}