<script>
    import circle from "../assets/icons/circle.svg";
    import ellipse from "../assets/icons/ellipse.svg";
    import rectangle from "../assets/icons/rectangle.svg";
    import triangle from "../assets/icons/triangle.svg";
    import brush from "../assets/icons/brush.svg";
    import eraser from "../assets/icons/eraser.svg";
    import Button from "./Button.svelte";
    import Tool from "./Tool.svelte";
    import { selectedTool, toolsInfo } from "../stores";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let selectedToolName = "brush";
    let brushWidth = 5;
    let selectedColor = "#000";

    let fillColor = false;
    let sizeSlider;

    $: selectedToolName, selectedColor, brushWidth, fillColor, update();
    const update = () => {
        toolsInfo.update(() => {
            return {
                selectedTool: selectedToolName,
                brushWidth: brushWidth,
                selectedColor: selectedColor,
                fillColor: fillColor,
            };
        });
    };
    const select = (name) => {
        selectedToolName = name;
        selectedTool.update(() => {
            return name;
        });
    };

    let colors = [
        { hex: "#CD5C5C", selected: true },
        { hex: "#FFBF00", selected: false },
        { hex: "#008000", selected: false },
        { hex: "#800080", selected: false },
        { hex: "#008080", selected: false },
    ];
</script>

<section class="px-4 py-6 flex flex-col border rounded-lg">
    <div class="mt-2.5 mb-1">
        <div class="mb-2">Shapes</div>
        <ul class="pl-2.5">
            <Tool
                title={"Rectangle"}
                img={rectangle}
                on:click={() => {
                    select("rectangle");
                }}
            />
            <Tool
                title={"Triangle"}
                img={triangle}
                on:click={() => {
                    select("triangle");
                }}
            />
            <Tool
                title={"Circle"}
                img={circle}
                on:click={() => {
                    select("circle");
                }}
            />
            <Tool
                title={"Ellipse"}
                img={ellipse}
                on:click={() => {
                    select("ellipse");
                }}
            />

            <button
                class="space-x-3 text-gray-700 hover:text-blue-400 cursor-pointer"
            >
                <input
                    id="fill-color"
                    type="checkbox"
                    class="outline-0"
                    on:change={() => {
                        fillColor = !fillColor;
                    }}
                />
                <label for="fill-color" class="cursor-pointer">Fill color</label
                >
            </button>
        </ul>
    </div>

    <div class="mt-2.5 mb-1">
        <div class="mb-2">Options</div>
        <ul class="pl-2.5">
            <Tool
                title={"Brush"}
                img={brush}
                on:click={() => {
                    select("brush");
                }}
            />
            <Tool
                title={"Eraser"}
                img={eraser}
                on:click={() => select("eraser")}
            />
            <li class="option">
                <!-- <img src={circle} alt="" width="{brushWidth}px" /> -->
                <input
                    bind:this={sizeSlider}
                    on:change={() => {
                        brushWidth = sizeSlider.value;
                    }}
                    type="range"
                    id="size-slider"
                    min="1"
                    max="30"
                    value="5"
                    class="outline-0 w-full h-1.5 mt-2.5"
                />
            </li>
        </ul>
    </div>
    <div class="mt-2.5 mb-6">
        <div class="mb-2">Colors</div>
        <ul class="flex flex-row justify-between">
            {#each colors as color}
                <button
                    class="w-6 h-6 rounded-full mt-1 relative border border-gray-600"
                    class:selected={color.selected}
                    style="background-color:{color.hex}"
                    on:click={() => {
                        selectedColor = color.hex;
                        let newColors = colors.map((item) => {
                            if (item.hex != color.hex) {
                                item.selected = false;
                            } else {
                                item.selected = true;
                            }
                            return item;
                        });
                        colors = newColors;
                    }}
                />
            {/each}
            <li class="w-6 h-6 rounded-full mt-1 relative overflow-hidden">
                <input
                    type="color"
                    id="color-picker"
                    value="#4A98F7"
                    class="w-10 h-10 cursor-pointer absolute -right-2 -top-2"
                    on:change={(e) => {
                        selectedColor = e.target.value;
                        colors.shift();
                        colors.push({
                            hex: selectedColor,
                            selected: true,
                        });
                        let newColors = colors.map((item) => {
                            if (item.hex != selectedColor) {
                                item.selected = false;
                            } else {
                                item.selected = true;
                            }
                            return item;
                        });
                        colors = newColors;
                    }}
                />
            </li>
        </ul>
    </div>
    <div class="row buttons">
        <Button
            cssClass={"clear-canvas"}
            on:click={() => {
                dispatch("clear");
            }}>Clear Canvas</Button
        >
        <Button
            cssClass={"save-img"}
            on:click={() => {
                dispatch("save");
            }}
            >Download
        </Button>
    </div>
</section>

<style>
    .selected::before {
        position: absolute;
        content: "";
        top: 50%;
        left: 50%;
        height: 12px;
        width: 12px;
        background: inherit;
        border-radius: 50%;
        border: 2px solid #fff;
        transform: translate(-50%, -50%);
    }
</style>
