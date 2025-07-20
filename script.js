const form = document.getElementById('resumeForm');
const resumeDisplay = document.getElementById('resumeDisplay');
const downloadSection = document.getElementById('downloadSection');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreview');

// Store section elements for conditional display
const sections = {
  objective: document.getElementById('objectiveSection'),
  experience: document.getElementById('experienceSection'),
  education: document.getElementById('educationSection'),
  skills: document.getElementById('skillsSection'),
  certificate: document.getElementById('certificateSection'),
  interests: document.getElementById('interestsSection'),
  activities: document.getElementById('activitiesSection'),
  internships: document.getElementById('internshipsSection')
};

photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photoPreview.src = e.target.result;
      photoPreview.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form values
  const formData = {
    fullName: document.getElementById('fullName').value,
    objective: document.getElementById('objective').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    education: document.getElementById('education').value,
    skills: document.getElementById('skills').value,
    certificate: document.getElementById('certificate').value,
    interests: document.getElementById('interests').value,
    experience: document.getElementById('experience').value,
    internships: document.getElementById('internships').value,
    activities: document.getElementById('activities').value
  };

  // Set resume content
  document.getElementById('nameText').textContent = formData.fullName;
  document.getElementById('objectiveText').textContent = formData.objective;
  document.getElementById('contactText').textContent = `${formData.email} • ${formData.phone}`;
  
  // Handle multi-line content with list items
  document.getElementById('expList').innerHTML = formData.experience
    .split('\n')
    .filter(item => item.trim() !== '')
    .map(item => `<li>${item}</li>`)
    .join('');
  
  document.getElementById('eduList').innerHTML = formData.education
    .split('\n')
    .filter(item => item.trim() !== '')
    .map(item => `<li>${item}</li>`)
    .join('');
  
  document.getElementById('skillsText').textContent = formData.skills;
  document.getElementById('certificateText').textContent = formData.certificate;
  document.getElementById('interestsText').textContent = formData.interests;
  document.getElementById('internshipsText').textContent = formData.internships;

  document.getElementById('activitiesList').innerHTML = formData.activities
    .split('\n')
    .filter(item => item.trim() !== '')
    .map(item => `<li>${item}</li>`)
    .join('');

  // Show/hide sections based on content
  toggleSection('objective', formData.objective);
  toggleSection('experience', formData.experience);
  toggleSection('education', formData.education);
  toggleSection('skills', formData.skills);
  toggleSection('certificate', formData.certificate);
  toggleSection('interests', formData.interests);
  toggleSection('activities', formData.activities);
  toggleSection('internships', formData.internships);

  // Show resume and download section
  resumeDisplay.classList.remove('d-none');
  downloadSection.classList.remove('d-none');
  resumeDisplay.scrollIntoView({ behavior: 'smooth' });
});

function toggleSection(sectionId, content) {
  if (content.trim() === '') {
    sections[sectionId].classList.add('d-none');
  } else {
    sections[sectionId].classList.remove('d-none');
  }
}

document.getElementById('downloadBtn').addEventListener('click', function () {
  if (resumeDisplay.classList.contains('d-none')) {
    alert("Please fill the form and generate your resume before downloading.");
    return;
  }

  // Create clone to fix rendering issues
  const element = document.getElementById('resumeDisplay');
  const clone = element.cloneNode(true);
  clone.style.width = '100%';
  clone.style.padding = '20px';
  document.body.appendChild(clone);
  
  // Add slight delay to ensure image loads
  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
          compress: true
        }
      })
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(clone);
      });
  }, 500);
});