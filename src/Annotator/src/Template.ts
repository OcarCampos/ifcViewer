import * as OBC from '@thatopen/components';
import * as BUI from '@thatopen/ui';
import { Annotator } from './Annotator';

export interface AnnotateUIState {
    components: OBC.Components;
}

export const annotateTool = (state: AnnotateUIState) => {
    const {components} = state;
    const annotator = components.get(Annotator);

    return BUI.Component.create<BUI.Button>( () => {
        return BUI.html `
            <bim-button
                tooltip-title="Annotate"
                icon="solar:document-bold"
                @click=${() => annotator.addAnnotation()}
            ></bim-button> 
        `;
    });
}