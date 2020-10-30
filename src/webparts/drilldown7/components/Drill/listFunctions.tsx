
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

import { Web, IList, IItem } from "@pnp/sp/presets/all";

import { ICustViewDef, IQuickButton } from '../../components/IReUsableInterfaces';

import { getHelpfullError } from '../../../../services/ErrorHandler';

 /***
 *     d888b  d88888b d888888b      db    db d888888b d88888b db   d8b   db      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *    88' Y8b 88'     `~~88~~'      88    88   `88'   88'     88   I8I   88      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *    88      88ooooo    88         Y8    8P    88    88ooooo 88   I8I   88      88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
 *    88  ooo 88~~~~~    88         `8b  d8'    88    88~~~~~ Y8   I8I   88      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
 *    88. ~8~ 88.        88          `8bd8'    .88.   88.     `8b d8'8b d8'      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
 *     Y888P  Y88888P    YP            YP    Y888888P Y88888P  `8b8' `8d8'       YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                                                             
 *                                                                                                                                                             
 */

function getBestFitView (  viewDefs: ICustViewDef[], currentWidth: number ) {
    let result : ICustViewDef = null;

    let maxViewWidth: number = 0 ;

    viewDefs.map( vd => {
        let thisWidth: number = typeof vd.minWidth === 'string' ? parseInt(vd.minWidth,10) : vd.minWidth;
        if ( currentWidth >= thisWidth && thisWidth >= maxViewWidth ) {
            result = vd;
            maxViewWidth = thisWidth;
        }
    });

    console.log('getAppropriateViewFields: currentWidth = ', currentWidth);
    console.log('getAppropriateViewFields: Width >= ', maxViewWidth);
    console.log('getAppropriateViewFields: vd result', result);

    return result;
    
}


export function getAppropriateViewFields ( viewDefs: ICustViewDef[], currentWidth: number ) {
    let result : IViewField[] = [];

    if ( viewDefs ) {

        result = getBestFitView( viewDefs, currentWidth ).viewFields;
    
        let avgWidth = result.length > 0 ? currentWidth/result.length : 100;
        let completeResult = result.map( f => {
    
            let thisField = f;
            let minWidth = thisField.minWidth ? thisField.minWidth : avgWidth;
            let maxWidth = thisField.maxWidth ? thisField.maxWidth : minWidth  + 100;
            if ( thisField.minWidth === undefined ) { thisField.minWidth = minWidth; }
            if ( thisField.maxWidth === undefined ) { thisField.maxWidth = maxWidth; }
            if ( thisField.isResizable === undefined ) { thisField.isResizable = true; }
            if ( thisField.sorting === undefined ) { thisField.sorting = true; }
            return thisField;
        });
        /*        */

        console.log('getAppropriateViewFields: completeResult', completeResult);

        return completeResult;

    } else {
        alert('View Def is not available... can not show any items! - see getAppropriateViewFields()');
        return null;
    }

}

export function getAppropriateViewGroups ( viewDefs: ICustViewDef[], currentWidth: number ) {
    let result : IGrouping[] = [];

    if ( viewDefs ) {

        result = getBestFitView( viewDefs, currentWidth ).groupByFields;
        //console.log('getAppropriateViewGroups: ', result);
        return result;

    } else {
        alert('View Def is not available... can not show any items! - see getAppropriateViewGroups()');
        return null;
    }

}

export function getAppropriateViewProp ( viewDefs: ICustViewDef[], currentWidth: number, prop: 'includeDetails' | 'includeAttach' | 'includeListLink' ) {
    let result : boolean = false;

    if ( viewDefs ) {
        result = getBestFitView( viewDefs, currentWidth )[prop];
        //console.log('getAppropriateDetailMode: ', result);
        return result;
    } else {
        alert('View Def is not available... can not show any items! - see getAppropriateViewProp()');
        return null;
    }
}

export async function updateReactListItem( webUrl: string, listName: string, Id: number, thisButtonObject : IQuickButton ): Promise<void>{


    //lists.getById(listGUID).webs.orderBy("Title", true).get().then(function(result) {
    //let allItems : IDrillItemInfo[] = await sp.web.webs.get();

    let results : any[] = [];

    let thisListWeb = Web(webUrl);

    let errMessage = null;

    try {
        let thisListObject = await thisListWeb.lists.getByTitle(listName);
        await thisListObject.items.getById(Id).update( thisButtonObject.updateItem ).then((response) => {
            if ( thisButtonObject.alert )  { alert( 'Success!\n' + thisButtonObject.alert ); }
            if ( thisButtonObject.console )  { console.log(thisButtonObject.console, response ); }
            
        });

    } catch (e) {
        errMessage = getHelpfullError(e, true, true);
        if ( thisButtonObject.alert )  { 
            alert( 'Update Failed!\n' + thisButtonObject.alert + "\n" + errMessage );
         }
         console.log('Update Failed!\n' + thisButtonObject.alert + "\n" + errMessage );
    }

    return errMessage;

}