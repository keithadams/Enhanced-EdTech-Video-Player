var Rectangle = function(){

    function init() {
        console.log("rectangle init");
    }

    function coordinatesToRectObject(c) {
        var rect = {};
        
        rect.minX = Math.min(c[0],c[2]);
        rect.maxX = Math.max(c[0],c[2]);
        rect.minY = Math.min(c[1],c[3]);
        rect.maxY = Math.max(c[1],c[3]);
        rect.width = Math.abs(rect.minY-rect.maxY);
        rect.length = Math.abs(rect.minX-rect.maxX);
        rect.area = rect.width * rect.length;
        
        return rect;
    }


    // source
    // http://stackoverflow.com/questions/5144615/difference-xor-between-two-rectangles-as-rectangles
    function diffRect(rectObject1,rectObject2) {
            
        var r = rectObject1,
            s = rectObject2;
                
        var a = Math.min( r.minX, s.minX ),
            b = Math.max( r.minX, s.minX ),
            c = Math.min( r.maxX, s.maxX ),
            d = Math.max( r.maxX, s.maxX );

        var e = Math.min( r.minY, s.minY ),
            f = Math.max( r.minY, s.minY ),
            g = Math.min( r.maxY, s.maxY ),
            h = Math.max( r.maxY, s.maxY );
            
        // X = intersection, 0-7 = possible difference areas
        //
        // origin upper left, positive y down
        //
        // . a b c d
        // e +-+-+-+
        // . |0|1|2|
        // f +-+-+-+
        // . |3|X|4|
        // g +-+-+-+
        // . |5|6|7|
        // h +-+-+-+
        
        var result = [];
        
        // we'll always have rectangles 1, 3, 4 and 6
        result.push(coordinatesToRectObject([b,e,c,f]));
        result.push(coordinatesToRectObject([a,f,b,g]));
        result.push(coordinatesToRectObject([c,f,d,g]));
        result.push(coordinatesToRectObject([b,g,c,h]));
        
        // decide which corners
        if( r.minX == a && r.minY == e || s.minX == a && s.minY == e ){ 
            // corners 0 and 7
            result.push(coordinatesToRectObject([a,e,b,f]));
            result.push(coordinatesToRectObject([c,g,d,h]));
        }
        else{ 
            // corners 2 and 5
            result.push(coordinatesToRectObject([c,e,d,f]));
            result.push(coordinatesToRectObject([a,g,b,h]));
        }
        
        // intersection
        result.push(coordinatesToRectObject([b,f,c,g]));

        return result;  
    }

    function isIntersectingRect(rectObjectA,rectObjectB){
        
        var a = rectObjectA;
        var b = rectObjectB;
        
        var c1 = a.minX < b.maxX;
        var c2 = a.maxX > b.minX;
        var c3 = a.minY < b.maxY;
        var c4 = a.maxY > b.minY;
        
        return c1 && c2 && c3 && c4;
    }

    function getDiffArea(rectObjA,rectObjB){
        return rectObjA.area + rectObjB.area - getIntersectArea(rectObjA,rectObjB)
    }

    function getIntersectArea(rectObjA,rectObjB){
        
        
        if (!isIntersectingRect(rectObjA,rectObjB))
            return 0;
        
        var diffRectArray = diffRect(rectObjA,rectObjB);
        return diffRectArray[diffRectArray.length-1].area;
    }


    function compareRect(coord1,coord2,playerArea){
        if(coord1 == null || coord2 == null) {
            coord1 = [0,0,10,10]
            coord2 = [20,20,30,30]
        }

        var aCoord = coord1;
        var bCoord = coord2;
        var a = coordinatesToRectObject(aCoord);
        var b = coordinatesToRectObject(bCoord);
        
        a.playerAreaRatio = (a.area == 0) ? 0 : playerArea / a.area;
        b.playerAreaRatio = (b.area == 0) ? 0 : playerArea / b.area;
                
        var intersectionArea = getIntersectArea(a,b);
        
        var a_diff = (a.area-intersectionArea)*a.playerAreaRatio;
        var b_diff = (b.area-intersectionArea)*b.playerAreaRatio;
        var intersect_diff = Math.abs(intersectionArea*(a.playerAreaRatio-b.playerAreaRatio));
        
        return a_diff + b_diff + intersect_diff;
        
    }

    return {
        "compareRect" : compareRect,
        "init": init
    };


    return {
        "compareRect" : compareRect,
        "init": init
    };
}();
