document.getElementById('retour').addEventListener('click', function() {
	window.location.reload();
});

var liste_bulles = document.getElementsByClassName('bubble');

var step = 100;
var tableau_result = [normal(0)];

for (var i = 1; i < step; i++) {
	tableau_result[i] = tableau_result[i-1] + normal(i/step);
}

for (var i = 0; i < liste_bulles.length; i++) {
	liste_bulles[i].style.height = liste_bulles[i].offsetWidth + "px";
	liste_bulles[i].addEventListener('mouseover', function() {
		////
	});

	liste_bulles[i].addEventListener('click', function() {
		var rgb = getAverageRGB(this.children[0]);

		var giant = document.createElement('div');
		document.body.append(giant);
		giant.classList.add('giant');
		giant.style.backgroundColor = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
		setTimeout(function() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			document.body.style.backgroundColor = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
			document.getElementById('premier').style.display = "none";
			document.getElementById('deuxieme').style.display = "block";
			document.body.removeChild(giant);

			var liste_projet = document.getElementsByClassName('projet');

			for (var i = 0; i < liste_projet.length; i++) {
				if (liste_projet[i].children.length > 1) {
					for (var j = 1; j < liste_projet[i].children.length; j++) {
						liste_projet[i].children[j].style.display = "none";
					}
					var next_button = document.createElement('img');
					next_button.src = "images/arrow.png";
					next_button.classList.add('next_button');
					next_button.addEventListener('click', function() {
						var element = this.parentElement;
						for (var j = 0; j < element.children.length - 1; j++) {
							
							if (j == element.children.length - 3) {
								element.children[j].style.display = "none";
								element.children[0].style.display = "block";
								break;
							}
							if (element.children[j].style.display != "none") {
								element.children[j].style.display = "none";
								element.children[j + 1].style.display = "block";
								break;
							}
						}
					});
					liste_projet[i].appendChild(next_button);

					var previous_button = document.createElement('img');
					previous_button.src = "images/arrow.png";
					previous_button.classList.add('previous_button');
					liste_projet[i].appendChild(previous_button);
					previous_button.addEventListener('click', function() {
						var element = this.parentElement;
						for (var j = 0; j < element.children.length - 1; j++) {
							if (element.children[j].style.display != "none") {
								element.children[j].style.display = "none";
								if (j == 0) {
									element.children[element.children.length - 3].style.display = 'block';
									break;
								}
								
								element.children[j - 1].style.display = "block";
								break;
							}
						}
					});

					var position = getPosition(liste_projet[i]);
					next_button.style.top = position.top + (liste_projet[i].offsetHeight - next_button.offsetHeight)/2 + "px";
					previous_button.style.top = position.top + (liste_projet[i].offsetHeight - previous_button.offsetHeight)/2 + "px";
					next_button.style.left = position.left + liste_projet[i].offsetWidth - next_button.offsetWidth - 10 + "px";
					previous_button.style.left = position.left + 10 + "px";
				}
			}
		}, 1000);
	});
}



var softwaresBox = document.getElementById("softwares");

document.getElementById("softwares").style.height = softwaresBox.offsetWidth + "px";

var liste_softwares = document.getElementById('softwares').children;

var once = true;


window.addEventListener('scroll', function() {
	if (isInViewport(softwaresBox) && once) {
		once = false;

		degree = 2 * Math.PI/liste_softwares.length;
		radius = (softwaresBox.offsetHeight - document.getElementById('softwares').children[1].offsetWidth) /2;

		center = {
			top: getPosition(softwaresBox).top + (softwaresBox.offsetHeight - document.getElementById('softwares').children[1].offsetHeight)/2,
			left: getPosition(softwaresBox).left + (softwaresBox.offsetWidth - document.getElementById('softwares').children[1].offsetWidth)/2
		};


		for (var i = 0; i < liste_softwares.length; i++) {
			liste_softwares[i].style.opacity = 1;
			rotation(i);
		}
	}

	for (var i = 0; i < liste_bulles.length; i++) {
		liste_bulles[i].style.height = liste_bulles[i].offsetWidth + "px";
	}
});

var mobile = false

if (window.innerWidth < 800) mobile = true;

window.onresize = function() {
	if (window.innerWidth < 800 && mobile == false) {
		window.location.reload();
	}
	else if (window.innerWidth > 800 && mobile == true) {
		window.location.reload();
	}
	document.body.scrollTop = document.body.scrollTop + 1;
};

function rotation(nb, i) {
	var element = liste_softwares[nb];
	if (i == undefined) i = 0;

	i++;

	element.style.opacity = tableau_result[i] / tableau_result[step-1] / (nb * (step/i - 1));

	var stop_radian = degree * nb;

	var radian = stop_radian * tableau_result[i] / tableau_result[step-1]+ Math.PI/2;
	var cos = Math.cos(radian);
	var sin = Math.sin(radian);

	element.style.top =  center.top + sin * radius + "px";
	element.style.left =  center.left + cos * radius + "px";

	if (i < step) setTimeout(function() {rotation(nb, i)}, 700/step);
}

function getPosition(el) {
	var x = 0;
	var y = 0;
	while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		x += el.offsetLeft - el.scrollLeft;
		y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: y, left: x };
}

function normal(x, esperance, ecart_type) {
	if (esperance == undefined) esperance = 0;
	if (ecart_type == undefined) ecart_type = 1;

	return Math.pow(Math.E, -1/2 *Math.pow((x - esperance)/ecart_type, 2)) / (ecart_type * Math.sqrt(2*Math.PI));
}

function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight*1.5 || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

function getAverageRGB(imgEl) {

	var blockSize = 5, // only visit every 5 pixels
		defaultRGB = {r:10,g:0,b:0}, // for non-supporting envs
		canvas = document.createElement('canvas'),
		context = canvas.getContext && canvas.getContext('2d'),
		data, width, height,
		i = -4,
		length,
		rgb = {r:0,g:0,b:0},
		count = 0;

	if (!context) {
		return defaultRGB;
	}

	height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

	context.drawImage(imgEl, 0, 0);

	try {
		data = context.getImageData(0, 0, width, height);
	} catch(e) {
		console.log(e);
		/* security error, img on diff domain */
		return defaultRGB;
	}

	length = data.data.length;

	while ( (i += blockSize * 4) < length ) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i+1];
		rgb.b += data.data[i+2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r/count);
	rgb.g = ~~(rgb.g/count);
	rgb.b = ~~(rgb.b/count);

	return rgb;

}