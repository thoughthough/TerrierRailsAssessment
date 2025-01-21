console.log("schedule.js is loaded and running");

document.addEventListener("DOMContentLoaded", function() {
    console.log("Page fully loaded, running overlap detection...");
    detectOverlaps(); 
    // Listen for clicks on .clickable-slot
    document.querySelectorAll(".clickable-slot").forEach((slot) => {
      slot.addEventListener("click", function() {
        const hour = parseInt(this.dataset.hour, 10);
        const technicianId = parseInt(this.dataset.technicianId, 10);
  
        // Schedule starts at 6 AM
        const startHour = 6;
        // Convert clicked hour to minutes since startHour
        const clickTime = (hour - startHour) * 60; 
  
        // Find the containing column for this technician
        const column = this.closest(".technician-column");
  
        // Track the end of the previous block (previousEnd)
        // and the start of the next block (nextStart)
        let previousEnd = 0;        // earliest possible end
        let nextStart = 24 * 60;    // 1440 minutes (end of day)
  
        // For each .work-order-block in this column
        column.querySelectorAll(".work-order-block").forEach((block) => {
          // Read inline style. top (start offset) and height (duration)
          const topPx = parseInt(block.style.top.replace("px", ""), 10);
          const heightPx = parseInt(block.style.height.replace("px", ""), 10);
  
          // The block starts at `topPx` minutes from startHour
          // and ends at `blockEnd = topPx + heightPx`
          const blockStart = topPx;
          const blockEnd   = topPx + heightPx;
  
          // If block ends before the clickTime (previous)
          // see if it's the latest one so far
          if (blockEnd <= clickTime && blockEnd > previousEnd) {
            previousEnd = blockEnd;
          }
  
          // If block starts after the clickTime (next)
          // see if it's the earliest one so far
          if (blockStart >= clickTime && blockStart < nextStart) {
            nextStart = blockStart;
          }
        });
  
        // The available gap is the difference between the end of the previous block
        // and the start of the next block
        const available = nextStart - previousEnd;
        alert(`There are ${available} minutes available in this slot for technician #${technicianId}.`);
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
  