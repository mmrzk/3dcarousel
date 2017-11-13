onload = function(){
	const sliders = [...document.querySelectorAll("#carousel img")];
	let rX = 200, rZ=100;
	let len = sliders.length;
	let space = 2*Math.PI/len;
	let startRad=Math.PI/2;
	let modifier=Math.PI/2;
	let nextRad=modifier;
	let lastIndex=0;
	let btnCurrIndex=0;
	let clearAuto;

	const easeInOut = (t)=>-Math.cos(t*Math.PI)*0.5+0.5;

	const rotate = ()=>
	{
		sliders.forEach((el, index)=>{
			const rad = index*space + modifier;
			const x = Math.cos(rad)*rX;
			const z = Math.sin(rad)*rZ*0.5-rZ/2;
			el.style.transform=`translate3D(${x}px, ${-z*0.75}px, ${z}px)`;
			el.style.zIndex=Math.round((z+rZ)/rZ * len*10);
			
			/* fade in-out when going through neighbor slider */
			/*const fRad = rad%(Math.PI*2);
			const start = Math.PI/2+space/4;
			const end = Math.PI/2+3*space/4;
			const duration = end-start;

			if(fRad>start && fRad<end){
				lastIndex=index;
				const time = 1-(fRad-start)/duration;
				el.style.opacity = Math.cos(time*Math.PI*2)*0.5+0.5;
			}*/
		});
	};

	rotate();

	let clear;
	const animateRot = ()=>{
		if(clear)
		{
			clearInterval(clear);
		}
		if(clearAuto)
		{
			clearInterval(clearAuto);
		}
		let distance = nextRad-modifier;
		if(Math.abs(distance)>Math.PI)
		{
			if(Math.sign(distance)>0)
			{
				distance-=Math.PI*2;
			}
			else
			{
				distance+=Math.PI*2;
			}
		}
		let walked = 0;
		const step = 0.01;
		const start = modifier;
		clear = setInterval(()=>{
			walked+=step;
			const time = Math.abs(walked/distance);
			modifier = start+distance*easeInOut(time);
			if(Math.abs(Math.abs(distance)-walked)<=step)
			{
				modifier=nextRad;
				clearInterval(clear);
				autoRotate(3000);
			}
			rotate();
		}, 20);
	};

	const btns = [...document.getElementById("btn").getElementsByTagName("li")];

	btns.forEach((el, index)=>{
		el.addEventListener("click", (e)=>{
			btns.forEach((el)=>{
				el.classList.remove("highlight");
			});
			el.classList.add("highlight");
			if(btnCurrIndex!=index)
			{
				nextRad=startRad+space*index;
				btnCurrIndex=index;
				gIndex=index;
				animateRot();
			}
		});
	});

	var gIndex = 1;
	var autoRotate = (time)=>{
		clearAuto = setTimeout(()=>{
			btns.forEach((el)=>{
				el.classList.remove("highlight");
			});
			btns[gIndex].classList.add("highlight");
			nextRad=startRad+space*gIndex;
			btnCurrIndex=gIndex;
			animateRot();
			gIndex++;
			if(gIndex>len-1)
				gIndex=0;
		}, time);
	};

	autoRotate(1000);
};