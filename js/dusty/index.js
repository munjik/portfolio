/*Downloaded from https://www.codeseek.co/adkatrit/dusty-particle-sphere-jBrao */
(function() {
    // Hungarian notation
    // (http://en.wikipedia.org/wiki/Hungarian_notation)
    // n - HTML-Node
    // o - object
    // s - string
    // i - integer
    // a - array
    // b - boolean
    // f - float
    // p - Particle
    // fn - function
    // ctx - 2D Context

    // General Functions
    var app, fnAddEventListener, fnRequestAnimationFrame;

    fnRequestAnimationFrame = function(fnCallback) {
        var fnAnimFrame;
        fnAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(fnCallback) {
            window.setTimeOut(fnCallback, 1000 / 60);
        };
        fnAnimFrame(fnCallback);
    };

    // Add Event Listener
    fnAddEventListener = function(o, sEvent, fn) {
        if (o.addEventListener) {
            o.addEventListener(sEvent, fn, false);
        } else {
            o['on' + sEvent] = fn;
        }
    };

    app = function() {
        var Particle, ctxRender, fAngle, fCosAngle, fMaxAX, fMaxAY, fMaxAZ, fPI, fSinAngle, fStartVX, fStartVY, fStartVZ, fVX, fnACos, fnCos, fnMax, fnMin, fnNextFrame, fnRender, fnRnd, fnRnd2, fnSetSize, fnSin, fnSwapList, h, iProjSphereX, iProjSphereY, iRadiusSphere, nBody, oBuffer, oDoc, oRadGrad, oRender, oStats, w;
        oStats = new Stats();
        oStats.setMode(0);
        oStats.domElement.style.position = 'absolute';
        oStats.domElement.style.left = '0px';
        oStats.domElement.style.top = '0px';
        document.body.appendChild(oStats.domElement);
        // General Elements
        oDoc = document;
        nBody = oDoc.body;
        // Shortcuts
        fPI = Math.PI;
        fnMax = Math.max;
        fnMin = Math.min;
        fnRnd = Math.random;
        fnRnd2 = function() {
            return 2.0 * fnRnd() - 1.0;
        };
        fnCos = Math.cos;
        fnACos = Math.acos;
        fnSin = Math.sin;
        // Sphere Settings
        iRadiusSphere = 150;
        iProjSphereX = 0;
        iProjSphereY = 0;
        // Particle Settings
        fMaxAX = 0.1;
        fMaxAY = 0.1;
        fMaxAZ = 0.1;
        fStartVX = 0.001;
        fStartVY = 0.001;
        fStartVZ = 0.001;
        fAngle = 0.0;
        fSinAngle = 0.0;
        fCosAngle = 0.0;
        window.iFramesToRotate = 2000.0;
        window.iPerspective = 250;
        window.iNewParticlePerFrame = 10;
        window.fGrowDuration = 200.0;
        window.fWaitDuration = 50.0;
        window.fShrinkDuration = 250.0;
       // window.aColor = [ 0, 255, 21]
      // window.aColor = [  66, 245, 132]
        // window.aColor = [66, 239, 245]

        window.aColor = [245,66,111]
        // window.aColor = [2, 182, 190];
        fVX = (2.0 * fPI) / window.iFramesToRotate;
        oRadGrad = null;
        ctxRender = nCanvasRender.getContext('2d');
        oRender = {
            pFirst: null
        };
        oBuffer = {
            pFirst: null
        };
        w = h = 0;
        // gets/sets size
        fnSetSize = function() {
            nCanvasRender.width = w = window.innerWidth;
            nCanvasRender.height = h = window.innerHeight;
            iProjSphereX = w / 2;
            iProjSphereY = h / 2;
            return {
                w: w,
                h: h
            };
        };
        fnSetSize();

        // window.onresize
        fnAddEventListener(window, 'resize', fnSetSize);
        fnSwapList = function(p, oSrc, oDst) {
            if (p != null) {
                // remove p from oSrc
                if (oSrc.pFirst === p) {
                    oSrc.pFirst = p.pNext;
                    if (p.pNext != null) {
                        p.pNext.pPrev = null;
                    }
                } else {
                    p.pPrev.pNext = p.pNext;
                    if (p.pNext != null) {
                        p.pNext.pPrev = p.pPrev;
                    }
                }
            } else {
                // create new p
                p = new Particle();
            }
            p.pNext = oDst.pFirst;
            if (oDst.pFirst != null) {
                oDst.pFirst.pPrev = p;
            }
            oDst.pFirst = p;
            p.pPrev = null;
            return p;
        };
        Particle = (function() {

            // Particle
            class Particle {
                fnInit() {
                    this.fAngle = fnRnd() * fPI * 2;
                    this.fForce = fnACos(fnRnd2());
                    this.fAlpha = 0;
                    this.bIsDead = false;
                    this.iFramesAlive = 0;
                    this.fX = iRadiusSphere * fnSin(this.fForce) * fnCos(this.fAngle);
                    this.fY = iRadiusSphere * fnSin(this.fForce) * fnSin(this.fAngle);
                    this.fZ = iRadiusSphere * fnCos(this.fForce);
                    this.fVX = fStartVX * this.fX;
                    this.fVY = fStartVY * this.fY;
                    this.fVZ = fStartVZ * this.fZ;
                    this.fGrowDuration = window.fGrowDuration + fnRnd2() * (window.fGrowDuration / 4.0);
                    this.fWaitDuration = window.fWaitDuration + fnRnd2() * (window.fWaitDuration / 4.0);
                    this.fShrinkDuration = window.fShrinkDuration + fnRnd2() * (window.fShrinkDuration / 4.0);
                    this.fAX = 0.0;
                    this.fAY = 0.0;
                    this.fAZ = 0.0;
                }

                fnUpdate() {
                    if (this.iFramesAlive > this.fGrowDuration + this.fWaitDuration) {
                        this.fVX += this.fAX + fMaxAX * fnRnd2();
                        this.fVY += this.fAY + fMaxAY * fnRnd2();
                        this.fVZ += this.fAZ + fMaxAZ * fnRnd2();
                        this.fX += this.fVX;
                        this.fY += this.fVY;
                        this.fZ += this.fVZ;
                    }
                    this.fRotX = fCosAngle * this.fX + fSinAngle * this.fZ;
                    this.fRotZ = -fSinAngle * this.fX + fCosAngle * this.fZ;
                    this.fRadiusCurrent = Math.max(0.01, window.iPerspective / (window.iPerspective - this.fRotZ));
                    this.fProjX = this.fRotX * this.fRadiusCurrent + iProjSphereX;
                    this.fProjY = this.fY * this.fRadiusCurrent + iProjSphereY;
                    this.iFramesAlive += 1;
                    if (this.iFramesAlive < this.fGrowDuration) {
                        this.fAlpha = this.iFramesAlive * 1.0 / this.fGrowDuration;
                    } else if (this.iFramesAlive < this.fGrowDuration + this.fWaitDuration) {
                        this.fAlpha = 1.0;
                    } else if (this.iFramesAlive < this.fGrowDuration + this.fWaitDuration + this.fShrinkDuration) {
                        this.fAlpha = (this.fGrowDuration + this.fWaitDuration + this.fShrinkDuration - this.iFramesAlive) * 1.0 / this.fShrinkDuration;
                    } else {
                        this.bIsDead = true;
                    }
                    if (this.bIsDead === true) {
                        fnSwapList(this, oRender, oBuffer);
                    }
                    this.fAlpha *= fnMin(1.0, fnMax(0.5, this.fRotZ / iRadiusSphere));
                    this.fAlpha = fnMin(1.0, fnMax(0.0, this.fAlpha));
                }

            };

            // Current Position
            Particle.prototype.fX = 0.0;

            Particle.prototype.fY = 0.0;

            Particle.prototype.fZ = 0.0;

            // Current Velocity
            Particle.prototype.fVX = 0.0;

            Particle.prototype.fVY = 0.0;

            Particle.prototype.fVZ = 0.0;

            // Current Acceleration
            Particle.prototype.fAX = 0.0;

            Particle.prototype.fAY = 0.0;

            Particle.prototype.fAZ = 0.0;

            // Projection Position
            Particle.prototype.fProjX = 0.0;

            Particle.prototype.fProjY = 0.0;

            // Rotation
            Particle.prototype.fRotX = 0.0;

            Particle.prototype.fRotZ = 0.0;

            // double linked list
            Particle.prototype.pPrev = null;

            Particle.prototype.pNext = null;

            Particle.prototype.fAngle = 0.0;

            Particle.prototype.fForce = 0.0;

            Particle.prototype.fGrowDuration = 0.0;

            Particle.prototype.fWaitDuration = 0.0;

            Particle.prototype.fShrinkDuration = 0.0;

            Particle.prototype.fRadiusCurrent = 0.0;

            Particle.prototype.iFramesAlive = 0;

            Particle.prototype.bIsDead = false;

            return Particle;

        }).call(this);
        fnRender = function() {
            var iCount, p;
            ctxRender.fillStyle = "#000";
            ctxRender.fillRect(0, 0, w, h);
            p = oRender.pFirst;
            iCount = 0;
            while (p != null) {
                ctxRender.fillStyle = "rgba(" + window.aColor.join(',') + ',' + p.fAlpha.toFixed(4) + ")";
                ctxRender.beginPath();
                ctxRender.arc(p.fProjX, p.fProjY, p.fRadiusCurrent, 0, 2 * fPI, false);
                ctxRender.closePath();
                ctxRender.fill();
                p = p.pNext;
                iCount += 1;
            }
        };
        fnNextFrame = function() {
            var iAddParticle, iCount, p, pNext;
            oStats.begin();
            fAngle = (fAngle + fVX) % (2.0 * fPI);
            fSinAngle = fnSin(fAngle);
            fCosAngle = fnCos(fAngle);
            iAddParticle = 0;
            iCount = 0;
            while (iAddParticle++ < window.iNewParticlePerFrame) {
                p = fnSwapList(oBuffer.pFirst, oBuffer, oRender);
                p.fnInit();
            }
            p = oRender.pFirst;
            while (p != null) {
                pNext = p.pNext;
                p.fnUpdate();
                p = pNext;
                iCount++;
            }
            fnRender();
            oStats.end();
            return fnRequestAnimationFrame(function() {
                return fnNextFrame();
            });
        };
        fnNextFrame();
        window.app = this;
    };

    fnAddEventListener(window, 'load', app);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFBLEdBQUEsRUFBQSxrQkFBQSxFQUFBOztFQWNBLHVCQUFBLEdBQTBCLFFBQUEsQ0FBQyxVQUFELENBQUE7QUFDeEIsUUFBQTtJQUFBLFdBQUEsR0FDRSxNQUFNLENBQUMscUJBQVAsSUFDQSxNQUFNLENBQUMsMkJBRFAsSUFFQSxNQUFNLENBQUMsd0JBRlAsSUFHQSxNQUFNLENBQUMsc0JBSFAsSUFJQSxNQUFNLENBQUMsdUJBSlAsSUFLQSxRQUFBLENBQUMsVUFBRCxDQUFBO01BQ0UsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsRUFBOEIsSUFBQSxHQUFPLEVBQXJDO0lBREY7SUFHRixXQUFBLENBQVksVUFBWjtFQVZ3QixFQWQxQjs7O0VBNEJBLGtCQUFBLEdBQXFCLFFBQUEsQ0FBQyxDQUFELEVBQUksTUFBSixFQUFZLEVBQVosQ0FBQTtJQUNuQixJQUFHLENBQUMsQ0FBQyxnQkFBTDtNQUNFLENBQUMsQ0FBQyxnQkFBRixDQUFtQixNQUFuQixFQUEyQixFQUEzQixFQUErQixLQUEvQixFQURGO0tBQUEsTUFBQTtNQUdFLENBQUUsQ0FBQSxJQUFBLEdBQU8sTUFBUCxDQUFGLEdBQW1CLEdBSHJCOztFQURtQjs7RUFPckIsR0FBQSxHQUFNLFFBQUEsQ0FBQSxDQUFBO0FBRUosUUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsS0FB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QUFBO01BSkY7TUFLQSxRQUFBLENBQUE7TUFFQSxNQUFNLENBQUMsR0FBUCxDQUFBO2FBQ0EsdUJBQUEsQ0FBd0IsUUFBQSxDQUFBLENBQUE7ZUFBTSxXQUFBLENBQUE7TUFBTixDQUF4QjtJQXJCWTtJQXVCZCxXQUFBLENBQUE7SUFFQSxNQUFNLENBQUMsR0FBUCxHQUFhO0VBek5UOztFQTROTixrQkFBQSxDQUFtQixNQUFuQixFQUEyQixNQUEzQixFQUFtQyxHQUFuQztBQS9QQSIsInNvdXJjZXNDb250ZW50IjpbIiMgSHVuZ2FyaWFuIG5vdGF0aW9uXG4jIChodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0h1bmdhcmlhbl9ub3RhdGlvbilcbiMgbiAtIEhUTUwtTm9kZVxuIyBvIC0gb2JqZWN0XG4jIHMgLSBzdHJpbmdcbiMgaSAtIGludGVnZXJcbiMgYSAtIGFycmF5XG4jIGIgLSBib29sZWFuXG4jIGYgLSBmbG9hdFxuIyBwIC0gUGFydGljbGVcbiMgZm4gLSBmdW5jdGlvblxuIyBjdHggLSAyRCBDb250ZXh0XG5cbiMgR2VuZXJhbCBGdW5jdGlvbnNcbmZuUmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZuQ2FsbGJhY2spIC0+XG4gIGZuQW5pbUZyYW1lID1cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIG9yXG4gICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSBvclxuICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3JcbiAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSBvclxuICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSBvclxuICAgIChmbkNhbGxiYWNrKSAtPlxuICAgICAgd2luZG93LnNldFRpbWVPdXQoZm5DYWxsYmFjaywgMTAwMCAvIDYwKVxuICAgICAgcmV0dXJuXG4gIGZuQW5pbUZyYW1lIGZuQ2FsbGJhY2tcbiAgcmV0dXJuXG5cbiMgQWRkIEV2ZW50IExpc3RlbmVyXG5mbkFkZEV2ZW50TGlzdGVuZXIgPSAobywgc0V2ZW50LCBmbikgLT5cbiAgaWYgby5hZGRFdmVudExpc3RlbmVyXG4gICAgby5hZGRFdmVudExpc3RlbmVyKHNFdmVudCwgZm4sIGZhbHNlKVxuICBlbHNlXG4gICAgb1snb24nICsgc0V2ZW50XSA9IGZuXG4gIHJldHVyblxuXG5hcHAgPSAoKSAtPlxuXG4gIG9TdGF0cyA9IG5ldyBTdGF0cygpXG4gIG9TdGF0cy5zZXRNb2RlKDApXG4gIG9TdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICBvU3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCdcbiAgb1N0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvU3RhdHMuZG9tRWxlbWVudClcblxuICAjIEdlbmVyYWwgRWxlbWVudHNcbiAgb0RvYyA9IGRvY3VtZW50XG4gIG5Cb2R5ID0gb0RvYy5ib2R5XG4gICMgU2hvcnRjdXRzXG4gIGZQSSA9IE1hdGguUElcbiAgZm5NYXggPSBNYXRoLm1heFxuICBmbk1pbiA9IE1hdGgubWluXG4gIGZuUm5kID0gTWF0aC5yYW5kb21cbiAgZm5SbmQyID0gKCkgLT4gMi4wICogZm5SbmQoKSAtIDEuMFxuICBmbkNvcyA9IE1hdGguY29zXG4gIGZuQUNvcyA9IE1hdGguYWNvc1xuICBmblNpbiA9IE1hdGguc2luXG4gICMgU3BoZXJlIFNldHRpbmdzXG4gIGlSYWRpdXNTcGhlcmUgPSAxNTBcbiAgaVByb2pTcGhlcmVYID0gMFxuICBpUHJvalNwaGVyZVkgPSAwXG4gICMgUGFydGljbGUgU2V0dGluZ3NcbiAgZk1heEFYID0gMC4xXG4gIGZNYXhBWSA9IDAuMVxuICBmTWF4QVogPSAwLjFcbiAgZlN0YXJ0VlggPSAwLjAwMVxuICBmU3RhcnRWWSA9IDAuMDAxXG4gIGZTdGFydFZaID0gMC4wMDFcbiAgZkFuZ2xlID0gMC4wXG4gIGZTaW5BbmdsZSA9IDAuMFxuICBmQ29zQW5nbGUgPSAwLjBcblxuICB3aW5kb3cuaUZyYW1lc1RvUm90YXRlID0gMjAwMC4wXG4gIHdpbmRvdy5pUGVyc3BlY3RpdmUgPSAyNTBcbiAgd2luZG93LmlOZXdQYXJ0aWNsZVBlckZyYW1lID0gMTBcbiAgd2luZG93LmZHcm93RHVyYXRpb24gPSAyMDAuMFxuICB3aW5kb3cuZldhaXREdXJhdGlvbiA9IDUwLjBcbiAgd2luZG93LmZTaHJpbmtEdXJhdGlvbiA9IDI1MC4wXG4gIHdpbmRvdy5hQ29sb3IgPSBbMiwgMTgyLCAxOTBdXG5cbiAgZlZYID0gKDIuMCAqIGZQSSkgLyB3aW5kb3cuaUZyYW1lc1RvUm90YXRlXG5cbiAgb1JhZEdyYWQgPSBudWxsXG4gIGN0eFJlbmRlciA9IG5DYW52YXNSZW5kZXIuZ2V0Q29udGV4dCAnMmQnXG5cblxuICBvUmVuZGVyID0ge3BGaXJzdDogbnVsbH1cbiAgb0J1ZmZlciA9IHtwRmlyc3Q6IG51bGx9XG4gIFxuICB3ID0gaCA9IDBcblxuICAjIGdldHMvc2V0cyBzaXplXG4gIGZuU2V0U2l6ZSA9ICgpIC0+XG4gICAgbkNhbnZhc1JlbmRlci53aWR0aCA9IHcgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIG5DYW52YXNSZW5kZXIuaGVpZ2h0ID0gaCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIGlQcm9qU3BoZXJlWCA9IHcgLyAyXG4gICAgaVByb2pTcGhlcmVZID0gaCAvIDJcbiAgICB7dzogdywgaDogaH1cblxuICBmblNldFNpemUoKVxuICBcbiAgIyB3aW5kb3cub25yZXNpemVcbiAgZm5BZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ3Jlc2l6ZScsIGZuU2V0U2l6ZSlcblxuICBmblN3YXBMaXN0ID0gKHAsIG9TcmMsIG9Ec3QpIC0+XG4gICAgaWYgcD9cbiAgICAgICMgcmVtb3ZlIHAgZnJvbSBvU3JjXG4gICAgICBpZiBvU3JjLnBGaXJzdCBpcyBwXG4gICAgICAgIG9TcmMucEZpcnN0ID0gcC5wTmV4dFxuICAgICAgICBwLnBOZXh0LnBQcmV2ID0gbnVsbCBpZiBwLnBOZXh0P1xuICAgICAgZWxzZVxuICAgICAgICBwLnBQcmV2LnBOZXh0ID0gcC5wTmV4dFxuICAgICAgICBwLnBOZXh0LnBQcmV2ID0gcC5wUHJldiBpZiBwLnBOZXh0P1xuICAgIGVsc2VcbiAgICAgICMgY3JlYXRlIG5ldyBwXG4gICAgICBwID0gbmV3IFBhcnRpY2xlKClcbiAgXG4gICAgcC5wTmV4dCA9IG9Ec3QucEZpcnN0XG4gICAgb0RzdC5wRmlyc3QucFByZXYgPSBwIGlmIG9Ec3QucEZpcnN0P1xuICAgIG9Ec3QucEZpcnN0ID0gcFxuICAgIHAucFByZXYgPSBudWxsXG4gICAgcFxuICBcbiAgIyBQYXJ0aWNsZVxuICBjbGFzcyBQYXJ0aWNsZVxuICAgICMgQ3VycmVudCBQb3NpdGlvblxuICAgIGZYOiAwLjBcbiAgICBmWTogMC4wXG4gICAgZlo6IDAuMFxuICAgICMgQ3VycmVudCBWZWxvY2l0eVxuICAgIGZWWDogMC4wXG4gICAgZlZZOiAwLjBcbiAgICBmVlo6IDAuMFxuICAgICMgQ3VycmVudCBBY2NlbGVyYXRpb25cbiAgICBmQVg6IDAuMFxuICAgIGZBWTogMC4wXG4gICAgZkFaOiAwLjBcbiAgICAjIFByb2plY3Rpb24gUG9zaXRpb25cbiAgICBmUHJvalg6IDAuMFxuICAgIGZQcm9qWTogMC4wXG4gICAgIyBSb3RhdGlvblxuICAgIGZSb3RYOiAwLjBcbiAgICBmUm90WjogMC4wXG4gICAgIyBkb3VibGUgbGlua2VkIGxpc3RcbiAgICBwUHJldjogbnVsbFxuICAgIHBOZXh0OiBudWxsXG4gICAgXG4gICAgZkFuZ2xlOiAwLjBcbiAgICBmRm9yY2U6IDAuMFxuXG4gICAgZkdyb3dEdXJhdGlvbjogMC4wXG4gICAgZldhaXREdXJhdGlvbjogMC4wXG4gICAgZlNocmlua0R1cmF0aW9uOiAwLjBcbiAgICBcbiAgICBmUmFkaXVzQ3VycmVudDogMC4wXG4gICAgXG4gICAgaUZyYW1lc0FsaXZlOiAwXG4gICAgYklzRGVhZDogZmFsc2VcbiAgICAgIFxuICAgIGZuSW5pdDogKCkgLT5cbiAgICAgIEBmQW5nbGUgPSBmblJuZCgpICogZlBJICogMlxuICAgICAgQGZGb3JjZSA9IGZuQUNvcyhmblJuZDIoKSlcbiAgICAgIEBmQWxwaGEgPSAwXG4gICAgICBAYklzRGVhZCA9IGZhbHNlO1xuICAgICAgQGlGcmFtZXNBbGl2ZSA9IDA7XG4gICAgICBAZlggPSBpUmFkaXVzU3BoZXJlICogZm5TaW4oQGZGb3JjZSkgKiBmbkNvcyhAZkFuZ2xlKVxuICAgICAgQGZZID0gaVJhZGl1c1NwaGVyZSAqIGZuU2luKEBmRm9yY2UpICogZm5TaW4oQGZBbmdsZSlcbiAgICAgIEBmWiA9IGlSYWRpdXNTcGhlcmUgKiBmbkNvcyhAZkZvcmNlKVxuICAgICAgQGZWWCA9IGZTdGFydFZYICogQGZYXG4gICAgICBAZlZZID0gZlN0YXJ0VlkgKiBAZllcbiAgICAgIEBmVlogPSBmU3RhcnRWWiAqIEBmWlxuICAgICAgQGZHcm93RHVyYXRpb24gPSB3aW5kb3cuZkdyb3dEdXJhdGlvbiArIGZuUm5kMigpICogKHdpbmRvdy5mR3Jvd0R1cmF0aW9uIC8gNC4wKVxuICAgICAgQGZXYWl0RHVyYXRpb24gPSB3aW5kb3cuZldhaXREdXJhdGlvbiArIGZuUm5kMigpICogKHdpbmRvdy5mV2FpdER1cmF0aW9uIC8gNC4wKVxuICAgICAgQGZTaHJpbmtEdXJhdGlvbiA9IHdpbmRvdy5mU2hyaW5rRHVyYXRpb24gKyBmblJuZDIoKSAqICh3aW5kb3cuZlNocmlua0R1cmF0aW9uIC8gNC4wKVxuICAgICAgQGZBWCA9IDAuMFxuICAgICAgQGZBWSA9IDAuMFxuICAgICAgQGZBWiA9IDAuMFxuICAgICAgcmV0dXJuXG4gIFxuICAgIGZuVXBkYXRlOiAoKSAtPlxuICAgICAgaWYgQGlGcmFtZXNBbGl2ZSA+IEBmR3Jvd0R1cmF0aW9uICsgQGZXYWl0RHVyYXRpb25cbiAgICAgICAgQGZWWCArPSBAZkFYICsgZk1heEFYICogZm5SbmQyKClcbiAgICAgICAgQGZWWSArPSBAZkFZICsgZk1heEFZICogZm5SbmQyKClcbiAgICAgICAgQGZWWiArPSBAZkFaICsgZk1heEFaICogZm5SbmQyKClcbiAgICAgICAgQGZYICs9IEBmVlhcbiAgICAgICAgQGZZICs9IEBmVllcbiAgICAgICAgQGZaICs9IEBmVlpcblxuICAgICAgQGZSb3RYID0gZkNvc0FuZ2xlICogQGZYICsgZlNpbkFuZ2xlICogQGZaXG4gICAgICBAZlJvdFogPSAtZlNpbkFuZ2xlICogQGZYICsgZkNvc0FuZ2xlICogQGZaXG4gICAgICBAZlJhZGl1c0N1cnJlbnQgPSBNYXRoLm1heCgwLjAxLCB3aW5kb3cuaVBlcnNwZWN0aXZlIC8gKHdpbmRvdy5pUGVyc3BlY3RpdmUgLSBAZlJvdFopKVxuICAgICAgQGZQcm9qWCA9IEBmUm90WCAqIEBmUmFkaXVzQ3VycmVudCArIGlQcm9qU3BoZXJlWCBcbiAgICAgIEBmUHJvalkgPSBAZlkgKiBAZlJhZGl1c0N1cnJlbnQgKyBpUHJvalNwaGVyZVkgXG5cbiAgICAgIEBpRnJhbWVzQWxpdmUgKz0gMVxuXG4gICAgICBpZiBAaUZyYW1lc0FsaXZlIDwgQGZHcm93RHVyYXRpb25cbiAgICAgICAgQGZBbHBoYSA9IEBpRnJhbWVzQWxpdmUgKiAxLjAgLyBAZkdyb3dEdXJhdGlvblxuICAgICAgZWxzZSBpZiBAaUZyYW1lc0FsaXZlIDwgQGZHcm93RHVyYXRpb24gKyBAZldhaXREdXJhdGlvblxuICAgICAgICBAZkFscGhhID0gMS4wXG4gICAgICBlbHNlIGlmIEBpRnJhbWVzQWxpdmUgPCBAZkdyb3dEdXJhdGlvbiArIEBmV2FpdER1cmF0aW9uICsgQGZTaHJpbmtEdXJhdGlvblxuICAgICAgICBAZkFscGhhID0gKEBmR3Jvd0R1cmF0aW9uICsgQGZXYWl0RHVyYXRpb24gKyBAZlNocmlua0R1cmF0aW9uIC0gQGlGcmFtZXNBbGl2ZSkgKiAxLjAgLyBAZlNocmlua0R1cmF0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIEBiSXNEZWFkID0gdHJ1ZVxuXG4gICAgICBpZiBAYklzRGVhZCBpcyB0cnVlXG4gICAgICAgIGZuU3dhcExpc3QoQCwgb1JlbmRlciwgb0J1ZmZlcilcblxuICAgICAgQGZBbHBoYSAqPSBmbk1pbigxLjAsIGZuTWF4KDAuNSwgQGZSb3RaIC8gaVJhZGl1c1NwaGVyZSkpXG4gICAgICBAZkFscGhhID0gZm5NaW4oMS4wLCBmbk1heCgwLjAsIEBmQWxwaGEpKVxuICAgICAgcmV0dXJuXG4gICAgICBcbiAgZm5SZW5kZXIgPSAoKSAtPlxuICAgIGN0eFJlbmRlci5maWxsU3R5bGUgPSBcIiNmZmZcIlxuICAgIGN0eFJlbmRlci5maWxsUmVjdCgwLCAwLCB3LCBoKVxuXG4gICAgcCA9IG9SZW5kZXIucEZpcnN0XG4gICAgaUNvdW50ID0gMFxuICAgIHdoaWxlIHA/XG4gICAgICBjdHhSZW5kZXIuZmlsbFN0eWxlID0gXCJyZ2JhKFwiICsgd2luZG93LmFDb2xvci5qb2luKCcsJykgKyAnLCcgKyBwLmZBbHBoYS50b0ZpeGVkKDQpICsgXCIpXCJcbiAgICAgIGN0eFJlbmRlci5iZWdpblBhdGgoKVxuICAgICAgY3R4UmVuZGVyLmFyYyhwLmZQcm9qWCwgcC5mUHJvalksIHAuZlJhZGl1c0N1cnJlbnQsIDAsIDIgKiBmUEksIGZhbHNlKVxuICAgICAgY3R4UmVuZGVyLmNsb3NlUGF0aCgpXG4gICAgICBjdHhSZW5kZXIuZmlsbCgpXG4gICAgICBwID0gcC5wTmV4dFxuICAgICAgaUNvdW50ICs9IDFcbiAgICByZXR1cm5cbiAgXG4gIGZuTmV4dEZyYW1lID0gKCkgLT5cbiAgICBvU3RhdHMuYmVnaW4oKVxuICAgIGZBbmdsZSA9IChmQW5nbGUgKyBmVlgpICUgKDIuMCAqIGZQSSlcbiAgICBmU2luQW5nbGUgPSBmblNpbihmQW5nbGUpXG4gICAgZkNvc0FuZ2xlID0gZm5Db3MoZkFuZ2xlKVxuXG4gICAgaUFkZFBhcnRpY2xlID0gMFxuICAgIGlDb3VudCA9IDBcbiAgICB3aGlsZSBpQWRkUGFydGljbGUrKyA8IHdpbmRvdy5pTmV3UGFydGljbGVQZXJGcmFtZVxuICAgICAgcCA9IGZuU3dhcExpc3Qob0J1ZmZlci5wRmlyc3QsIG9CdWZmZXIsIG9SZW5kZXIpXG4gICAgICBwLmZuSW5pdCgpXG4gIFxuICAgIHAgPSBvUmVuZGVyLnBGaXJzdFxuICAgIHdoaWxlIHA/XG4gICAgICBwTmV4dCA9IHAucE5leHRcbiAgICAgIHAuZm5VcGRhdGUoKVxuICAgICAgcCA9IHBOZXh0XG4gICAgICBpQ291bnQrK1xuICAgIGZuUmVuZGVyKClcblxuICAgIG9TdGF0cy5lbmQoKVxuICAgIGZuUmVxdWVzdEFuaW1hdGlvbkZyYW1lICgpIC0+IGZuTmV4dEZyYW1lKCkgXG4gICAgXG4gIGZuTmV4dEZyYW1lKCkgIFxuXG4gIHdpbmRvdy5hcHAgPSBAXG4gIHJldHVyblxuICBcbmZuQWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdsb2FkJywgYXBwKSJdfQ==
//# sourceURL=coffeescrip
