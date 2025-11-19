// Art Gala Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initGallery();
    
    // Initialize lightbox
    initLightbox();
    
    // Initialize money counter animation
    animateMoneyCounter();
    
    // Initialize filter functionality
    initFilters();
    
    // Initialize donors list
    initDonors();
});

// Art Night photos (using same photos as Art Gala)
const artGalaBrothersPhotos = [
    '1-DA3A1145-D060-4CBD-861F-52342ED16361.jpg',
    '2-B40115CB-3690-48C9-A9DA-1FF13D4829DF(1).jpg',
    '3-B40115CB-3690-48C9-A9DA-1FF13D4829DF.jpg',
    '4-66F59869-7740-4A8C-B3B7-0BDF118281E8(1).jpg',
    '5-66F59869-7740-4A8C-B3B7-0BDF118281E8.jpg',
    '6-A557902D-3BB3-49EE-A38B-2BD1968C6359(1).jpg',
    '7-A557902D-3BB3-49EE-A38B-2BD1968C6359.jpg',
    '8-12FB96A4-4178-4155-B3E1-D2C295DF259A.jpg',
    '9-12FB96A4-4178-4155-B3E1-D2C295DF259A(1).jpg',
    '10-47DEEB0C-D880-46E7-B716-56C980187B5B(1).jpg',
    '11-47DEEB0C-D880-46E7-B716-56C980187B5B.jpg',
    '12-DCDB689C-3149-44BE-9159-6F5A874180A8.jpg',
    '13-8CA233B6-1BE5-4B47-BB48-3011F8D6E4E4.jpg',
    '14-5C8CA787-29D6-4AA1-8330-3D429EA99764.jpg',
    '15-6CC00228-AF4F-4692-91BE-9CA0F0FA511E.jpg',
    '16-B8193E73-1FAD-4751-8C98-05F0C13CEF1D.jpg',
    '17-87443F8E-9851-4B8A-95B8-ADF0F21936F8.jpg',
    '18-60199E2F-6C5F-47E1-BF8A-DDB956330EEF.jpg',
    '19-DSCN3852.jpg',
    '20-DSCN3853.jpg',
    '21-DSCN3854.jpg',
    '22-DSCN3855.jpg',
    '23-DSCN3865.jpg',
    '24-DSCN3866.jpg',
    '25-DSCN3867.jpg',
    '26-DSCN3869.jpg',
    '27-DSCN3871.jpg',
    '28-DSCN3872.jpg',
    '29-DSCN3873.jpg',
    '30-DSCN3874.jpg',
    '31-DSCN3875.jpg',
    '32-DSCN3877.jpg',
    '33-DSCN3878.jpg',
    '34-DSCN3882.jpg',
    '35-DSCN3884.jpg',
    '36-DSCN3885.jpg',
    '37-DSCN3886.jpg',
    '38-DSCN3887.jpg',
    '39-DSCN3889.jpg',
    '40-DSCN3890.jpg',
    '41-DSCN3891.jpg',
    '42-DSCN3892.jpg',
    '43-DSCN3894.jpg',
    '44-DSCN3896.jpg',
    '45-DSCN3897.jpg',
    '46-DSCN3898.jpg',
    '47-DSCN3899.jpg',
    '48-DSCN3900.jpg',
    '49-DSCN3901.jpg',
    '50-DSCN3902.jpg'
];

const artGalaSistersPhotos = [
    '1-875764FC-DAC4-42F3-96F0-5D77BBD735E0.jpg',
    '2-86AA2FD0-9B0A-4D6B-A18D-C7C4D69D4D7C.jpg',
    '3-7EE4E1B8-7BE3-4284-B88C-F7426FB1D11A.jpg',
    '4-AAD32E32-3C54-4B2F-95AD-56017DA636CD.jpg',
    '5-07AD4F9B-6201-4CF3-8312-41CD320F6952.jpg',
    '6-B3E4DFFE-58E8-41E1-881F-9DD7880C0710.jpg',
    '7-9D6A2842-6925-4CE6-BD02-E502F29355FC.jpg',
    '8-3706B967-E94C-41C5-901D-5D5E92736354.jpg',
    '9-010BB7CB-CEA2-4089-9200-37000849E4FD(1).jpg',
    '10-7475BAB2-BD37-4CDE-BB04-0F2CD951D9DA.jpg',
    '11-54072195-0B8A-4FAF-9475-9F7E17AA95E5.jpg',
    '12-ABEB13D1-70D3-468A-AC71-2693C00AB793.jpg',
    '13-56B203A7-FBB7-45E4-9D31-C32829CA882A.jpg',
    '14-1BE4D58B-E00A-4C40-B4DF-BE0C156B043D.jpg',
    '15-509FB180-693C-4568-ADB6-A389172277BB.jpg',
    '16-1EFEBD97-39AC-48A4-81B7-834FF1E1B262(1).jpg',
    '17-1BC48885-2759-424F-9975-5D53FB896AB8.jpg',
    '18-666DC898-2420-4316-8BC0-9B9F6D1EC162.jpg',
    '19-9B9B056A-6604-473D-AD08-FFDB0A507DF1.jpg',
    '20-9CA7B965-1FE7-46D0-BF0E-122F862DEF00.jpg',
    '21-8FC3789C-94C8-4D3B-95EA-47C9D9766EA3.jpg',
    '22-58771781-EED8-4514-BC21-B6AACA70CA41.jpg',
    '23-AA5B4374-2934-4AA5-806C-4E30BBEBD86D.jpg',
    '24-586E3EA9-26E0-405E-8E62-BB52BCF8D5A8.jpg',
    '25-6AF18240-BCD9-43AB-948A-D5FE0747B453.jpg',
    '26-A73C5801-FE19-4135-B94C-8F844B152B85.jpg',
    '27-5E56E4DC-6283-4D7B-A8F8-AB1C3F72C860.jpg',
    '28-908ADCED-00F7-4E6E-B83E-01DB85AC3745.jpg',
    '29-33209879-78CF-4978-BC2C-9C9108B9C291.jpg',
    '30-7CB38395-AC29-4D76-A37F-FCA0FA0613D0.jpg',
    '31-091FE60B-71C5-4CE1-A740-AEFB05F8A140.jpg',
    '32-7E7DBD4B-4A63-4E9F-9DFF-59C747DBCE12.jpg',
    '33-433AD09E-356F-4B64-9153-C9245FF95A97.jpg',
    '34-57AC4AF3-3133-4324-ACF9-CE744557440B.jpg',
    '35-0105D121-B320-49C0-B8A1-CB3E7BBC1281.jpg',
    '36-02A0C730-6B27-4A03-BE0E-6101CA7A41AB.jpg',
    '37-19FA6986-8F57-4BF4-9380-3AC4BF6542D5.jpg',
    '38-65CE5E74-49A6-4BA4-A40A-A079B2753A78.jpg',
    '39-5A53DC52-850A-4734-9404-27B7C00ABA5F.jpg',
    '40-19006ED7-DD8C-467B-9570-2F8177CDA5C7.jpg',
    '41-1BD37A98-1596-46A7-AF36-AED76C179E3E.jpg',
    '42-56639BBD-A631-4BCC-A761-BC6317648A22.jpg',
    '43-49327AAF-212D-4392-B5F3-D5EF342C4418.jpg',
    '44-8A8D4D1C-DD66-4301-95A6-75DD4368A2C2.jpg',
    '45-8A8D4D1C-DD66-4301-95A6-75DD4368A2C2.jpg',
    '46-0EA1E95B-0B5B-4375-98F1-AAFFF5A5927A.jpg',
    '47-94E61E4A-8630-41F2-9EF7-27883C955391.jpg',
    '48-39AEE1D2-171F-4D06-8534-86D35A9C0A08.jpg',
    '49-23657991-588A-4606-B7B3-E47FCBD924AB.jpg',
    '50-4A1CC67E-10AB-4BFD-BDF0-42BED0C60736.jpg',
    '51-74829EAD-ABDC-4F22-9EE9-0301769971ED.jpg',
    '52-59B23812-826B-4CEB-B0A9-52835980CC05.jpg',
    '53-26E0D407-14F3-40DD-8CD6-DEA41E9A5641.jpg',
    '54-BA84E4D8-CC92-4EC5-8F0C-43BF993EB514.jpg',
    '55-24175F9B-8AF2-4E3C-8047-1AB49DC2A934.jpg',
    '56-34501580-EA62-4839-9527-E52C57DDD1BB.jpg',
    '57-6A288AE3-2C59-4849-A4E6-347C42F4BAD0.jpg',
    '58-2209975D-6505-4ADB-80AB-171763CDA7BB.jpg',
    '59-0347D454-73F1-4882-B857-A3E7C756A5CB.jpg',
    '60-4387BEC7-B580-482F-8A70-CE38911ADA03.jpg',
    '61-B405D01D-944E-47E7-BEF5-AFA08559EA1A.jpg',
    '62-62D783A8-E3C0-49FC-8B21-A23826055C67.jpg',
    '63-9AFB3C22-3670-48A8-9EB8-3FF2B60BD9A0.jpg',
    '64-37D4222E-2963-4D69-9E3E-640D2D07BBA2.jpg',
    '65-4317F0B1-A511-43C5-B761-DC7C27F62229.jpg',
    '66-60D4CB6F-3A76-4C5E-80A3-19BC875C7C35.jpg',
    '67-8C35C982-1C30-4DF1-A66E-EC71DEA39A72.jpg',
    '68-081E8DD0-E336-4506-A234-7E5FA6D976AD.jpg',
    '69-7C10C20D-9431-430A-BB1E-ADBF2AADEA95.jpg',
    '70-13900EE1-54DD-4DA9-B21B-24DF23967CD6.jpg',
    '71-458785E6-0053-434F-8D0E-C1331B1CDD26.jpg',
    '72-9F9ECEC8-8D1E-468F-8ED5-F0F8CE4826C3.jpg',
    '73-992503AB-F0A5-4868-A008-04A06414866C.jpg',
    '74-886094F0-F8E8-47F5-A17A-671DA54A2ADB.jpg',
    '75-AB64EE46-5102-487B-A5EF-A45A43FD6863.jpg',
    '76-658BC33A-364F-4C96-8D85-D676ADC038FD.jpg',
    '77-86EAB3DA-BE8C-46C1-9F32-70237E0068DB.jpg',
    '78-9AA16CF0-FC45-44C6-870F-6231412907E1.jpg',
    '79-7499DCAC-4A88-4F56-9A78-E27B0F7C96AD.jpg',
    '80-4F2697FF-4BCE-4C19-853A-EDCCCDDB5F50.jpg',
    '81-5FEA6C7B-FBEF-4547-88C3-BBF6B4E80117.jpg',
    '82-8E58DB5A-2652-450F-A2A3-78EE999D0981.jpg',
    '83-097B5FFB-1E31-4942-9657-8A3E66A3245A.jpg',
    '84-AEF713C2-3A8D-40D9-9875-8EE6F57F533A.jpg',
    '85-A54958A5-1F14-49A7-8337-A6D5D56285FC.jpg',
    '86-2043904B-48F7-4ACF-97B7-B985C4F8319E.jpg'
];

let currentLightboxIndex = 0;
let currentLightboxPhotos = [];

function initGallery() {
    const brothersGrid = document.getElementById('brothers-grid');
    const sistersGrid = document.getElementById('sisters-grid');
    
    // Load brothers photos
    artGalaBrothersPhotos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = `images/Art Night _ Brothers _ Submissions/${photo}`;
        img.alt = `Art Gala Brothers Submission ${index + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox('brothers', index));
        brothersGrid.appendChild(img);
    });
    
    // Load sisters photos
    artGalaSistersPhotos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = `images/Art Night _ Sisters _ Submissions/${photo}`;
        img.alt = `Art Gala Sisters Submission ${index + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox('sisters', index));
        sistersGrid.appendChild(img);
    });
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleries = document.querySelectorAll('.photo-gallery');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide galleries
            galleries.forEach(gallery => {
                const category = gallery.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    gallery.style.display = 'block';
                } else {
                    gallery.style.display = 'none';
                }
            });
        });
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

function openLightbox(category, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Set current photos array
    if (category === 'brothers') {
        currentLightboxPhotos = artGalaBrothersPhotos.map(p => `images/Art Night _ Brothers _ Submissions/${p}`);
    } else {
        currentLightboxPhotos = artGalaSistersPhotos.map(p => `images/Art Night _ Sisters _ Submissions/${p}`);
    }
    
    currentLightboxIndex = index;
    lightboxImg.src = currentLightboxPhotos[index];
    lightboxCaption.textContent = `${category === 'brothers' ? 'Brothers' : 'Sisters'} Submission ${index + 1}`;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentLightboxPhotos.length - 1;
    } else if (currentLightboxIndex >= currentLightboxPhotos.length) {
        currentLightboxIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    lightboxImg.src = currentLightboxPhotos[currentLightboxIndex];
    
    const category = currentLightboxPhotos[0].includes('Brothers') ? 'Brothers' : 'Sisters';
    lightboxCaption.textContent = `${category} Submission ${currentLightboxIndex + 1}`;
}

function animateMoneyCounter() {
    const targetAmount = 5000; // Update this with actual amount raised
    const duration = 2000;
    const element = document.getElementById('moneyRaised');
    const startAmount = 0;
    const increment = targetAmount / (duration / 16);
    let current = startAmount;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetAmount) {
            current = targetAmount;
            clearInterval(timer);
        }
        element.textContent = `$${Math.floor(current).toLocaleString()}`;
    }, 16);
}

function initDonors() {
    // La Cocina Donors - Update this list with actual donor names
    const laCocinaDonors = [
        'Anonymous Donor',
        'MSA Community Fund',
        'Art Gala Attendees',
        'Local Community Supporters'
        // Add more donor names here
    ];
    
    // PCRF Donors - Update this list with actual donor names
    const pcrfDonors = [
        'Anonymous Donor',
        'MSA Community Fund',
        'Art Gala Attendees',
        'Local Community Supporters'
        // Add more donor names here
    ];
    
    const laCocinaList = document.getElementById('lacocina-donors');
    const pcrfList = document.getElementById('pcrf-donors');
    
    // Populate La Cocina donors
    if (laCocinaList) {
        laCocinaDonors.forEach(donor => {
            const donorItem = document.createElement('div');
            donorItem.className = 'donor-item';
            donorItem.textContent = donor;
            laCocinaList.appendChild(donorItem);
        });
    }
    
    // Populate PCRF donors
    if (pcrfList) {
        pcrfDonors.forEach(donor => {
            const donorItem = document.createElement('div');
            donorItem.className = 'donor-item';
            donorItem.textContent = donor;
            pcrfList.appendChild(donorItem);
        });
    }
}

