var interactive_content_example_loaded_before;

var setup = () => {
    const canvas = createCanvas(400, 400);
    canvas.parent(document.getElementById("interactive-javascript-example"));
    interactive_content_example_loaded_before = true;
    console.log("test");
}
if (interactive_content_example_loaded_before)
    setup();

var draw = () => {
    background(0);

    // The center of the canvas
    const canvas_center = [width / 2, height / 2];

    // The main circle's radius
    const radius = 150;

    // Draw the main circle
    push();
    {
        fill(0);
        stroke(255);
        circle(canvas_center[0], canvas_center[1], radius * 2);
    }
    pop();

    // Mouse location relative to center
    const mouse_loc = [mouseX - width / 2, mouseY - height / 2];
    // Get the angle of the mouse relative to the center
    const mouse_angle = Math.atan2(mouse_loc[1], mouse_loc[0]);

    // Get the circle pos relative to the origin
    const circle_pos = [Math.cos(mouse_angle) * radius, Math.sin(mouse_angle) * radius];

    // Get the canvas circle pos
    const canvas_circle_pos = [width / 2 + circle_pos[0], height / 2 + circle_pos[1]];

    // Draw a line towards the circle rotating around the origin
    push();
    {
        fill(0);
        stroke(255, 0, 0);
        line(canvas_center[0], canvas_center[1], canvas_circle_pos[0], canvas_circle_pos[1]);
    }
    pop();

    // Draw a line representing the x of the circle (cos)
    push();
    {
        fill(0);
        stroke(0, 255, 0);
        line(canvas_center[0], canvas_center[1], canvas_circle_pos[0], canvas_center[1]);
    }
    pop();

    // Draw a line representing the y of the circle (sin)
    push();
    {
        fill(0);
        stroke(0, 0, 255);
        line(canvas_circle_pos[0], canvas_center[1], canvas_circle_pos[0], canvas_circle_pos[1]);
    }
    pop();

    // Draw the circle at the angle the mouse is at relative to the origin
    push();
    {
        fill(0);
        stroke(255, 0, 0);
        circle(canvas_circle_pos[0], canvas_circle_pos[1], 50);
    }
    pop();
}