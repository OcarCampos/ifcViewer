import * as OBC from '@thatopen/components';

export class Annotator extends OBC.Component {
    static uuid = "bff48b92-1de0-4ce4-bee3-612acae867bd";

    enabled = true;
    constructor(components: OBC.Components) {
        super(components);
        this.components.add(Annotator.uuid, this);
    }

    addAnnotation() {
        console.log("Adding annotation");
    }
}


