import React from 'react';
import Chrome from "../features/chrome/Chrome";
import Canvas from "../features/canvas/Canvas";
import BackgroundGrid from "../features/canvas/BackgroundGrid";
import Elements from "../features/elements/Elements";
import SelectionBox from "../features/selection/SelectionBox";
import SelectionDragBox from "../features/selectionDragBox/SelectionDragBox";

export default function App() {
    return (
        <Chrome>
            <Canvas>
                <BackgroundGrid/>
                <Elements/>
                <SelectionBox/>
                <SelectionDragBox/>
            </Canvas>
        </Chrome>
    );
}

