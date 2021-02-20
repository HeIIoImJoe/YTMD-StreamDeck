import {DefaultAction} from "./default.action";
import {takeUntil} from "rxjs/operators";
import {StateType} from "streamdeck-typescript/dist/src/interfaces/enums";
import {KeyUpEvent, WillAppearEvent} from "streamdeck-typescript";

export class DislikeAction extends DefaultAction {
	disliked = false;

	onContextAppear(event: WillAppearEvent): void {
		this.ytmd.musicData.pipe(takeUntil(this.destroy$)).subscribe(data => {
			if (!data || data === true) {
				return;
			}
			const _disliked = data.player.likeStatus === 'DISLIKE';
			if (this.disliked !== _disliked) {
				this.disliked = _disliked;
				this.setContext(event.context);
				this.plugin.setState(this.disliked ? StateType.ON : StateType.OFF)
			}
		});
	}

	onKeypressUp(event: KeyUpEvent): void {
		this.sendAction('track-thumbs-down')
			.catch(() => this.plugin.showAlert());
	}
}
