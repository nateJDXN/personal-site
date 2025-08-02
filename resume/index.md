---
layout: default
title: resume
---

<div class="resume-controls">
  <a href="{{ '/assets/resume.pdf' | relative_url }}" download class="resume-btn" id="download-btn">
    <span class="btn-icon">⬇</span>
    Download PDF
  </a>
</div>

<br>


<div class="pdf-container">
  <object class="pdf" data="{{ '/assets/resume.pdf' | relative_url }}" type="application/pdf">
    <div class="pdf-fallback">
      <p>Your browser doesn't support PDF embedding.</p>
      <p><a href="{{ '/assets/resume.pdf' | relative_url }}" target="_blank">Click here to view the PDF</a></p>
    </div>
  </object>
</div>