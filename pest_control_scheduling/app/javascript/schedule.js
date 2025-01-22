console.log("schedule.js is loaded and running");

document.addEventListener("DOMContentLoaded", function () {
  console.log("Page fully loaded, running overlap detection...");
  detectOverlaps();

  document.querySelectorAll(".clickable-slot").forEach((slot) => {
    slot.addEventListener("click", function () {
      const hour = parseInt(this.dataset.hour, 10);
      const technicianId = parseInt(this.dataset.technicianId, 10);

      const startHour = 6;
      const clickTime = (hour - startHour) * 60;

      const column = this.closest(".technician-column");
      const blocks = Array.from(column.querySelectorAll(".work-order-block"));

      if (blocks.length === 0) {
        alert(`No blocks in this column; the entire slot is available.`);
        return;
      }

      let previousEnd = 0;
      let nextStart = 24 * 60;

      blocks
        .map((block) => {
          const computedStyle = window.getComputedStyle(block);
          const topPx = parseInt(computedStyle.top, 10);
          const heightPx = parseInt(computedStyle.height, 10);
          return { start: topPx, end: topPx + heightPx };
        })
        .sort((a, b) => a.start - b.start)
        .forEach(({ start, end }) => {
          if (end <= clickTime && end > previousEnd) {
            previousEnd = end;
          }
          if (start >= clickTime && start < nextStart) {
            nextStart = start;
          }
        });

      if (clickTime >= previousEnd && clickTime < nextStart) {
        alert("Click overlaps with an existing block.");
      } else {
        const available = nextStart - previousEnd;
        alert(
          `There are ${available} minutes available in this slot for technician #${technicianId}.`
        );
      }
    });
  });
});

  function detectOverlaps() {
    console.log("Detecting overlaps...");
    document.querySelectorAll(".technician-column").forEach((column) => {
      // Grab technician name from data attribute
      const technicianName = column.dataset.techName || "Unknown";
      console.log(`Checking technician: ${technicianName}`);
    
      const blocks = column.querySelectorAll(".work-order-block");
      console.log(`Found ${blocks.length} blocks for ${technicianName}`);
    
      const overlaps = [];
    
      // Compare every block with others in same column
      blocks.forEach((blockA, i) => {
        const topA = parseInt(blockA.style.top.replace("px", ""), 10);
        const heightA = parseInt(blockA.style.height.replace("px", ""), 10);
        const bottomA = topA + heightA;
    
        blocks.forEach((blockB, j) => {
          if (i !== j) {
            const topB = parseInt(blockB.style.top.replace("px", ""), 10);
            const heightB = parseInt(blockB.style.height.replace("px", ""), 10);
            const bottomB = topB + heightB;
    
            console.log(
              `Comparing Block A (top: ${topA}, bottom: ${bottomA}) with Block B (top: ${topB}, bottom: ${bottomB})`
            );
    
            // Check for overlap
            if (topA < bottomB && bottomA > topB) {
              console.log(`Overlap detected for technician: ${technicianName}`);
              overlaps.push([blockA, blockB]);
            }
          }
        });
      });
    
      // Highlight overlapping blocks
      overlaps.forEach(([blockA, blockB]) => {
        blockA.classList.add("overlap");
        blockB.classList.add("overlap");
      });
    
      // Display warning if overlaps detected
      if (overlaps.length > 0) {
        alert(`Warning: Overlapping bookings detected for ${technicianName}.`);
      }
    });
  }
  