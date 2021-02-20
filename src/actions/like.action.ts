import {DefaultAction} from "./default.action";
import {KeyUpEvent, WillAppearEvent} from "streamdeck-typescript";
import {takeUntil} from "rxjs/operators";
import {StateType} from "streamdeck-typescript/dist/src/interfaces/enums";

export class LikeAction extends DefaultAction {
    liked = false;

    onContextAppear(event: WillAppearEvent) {
        this.ytmd.musicData.pipe(takeUntil(this.destroy$)).subscribe(data => {
            if (!data || data === true) {
                return;
            }
            const _liked = data.player.likeStatus === 'LIKE';
            if (this.liked !== _liked) {
                this.liked = _liked;
	            this.setContext(event.context);
                this.plugin.setState(this.liked ? StateType.ON : StateType.OFF);
            }
        });
    }

    onKeypressUp(event: KeyUpEvent) {
        this.sendAction('track-thumbs-up')
	        .catch(() => this.plugin.showAlert());
    }
}
