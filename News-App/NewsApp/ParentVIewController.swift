//
//  PagerTabStripVIewCOntroller.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/6/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//

import UIKit
import SwiftSpinner
import CoreLocation
import Alamofire
import SwiftyJSON
import SwiftSpinner
import AlamofireImage
import XLPagerTabStrip

//MARK: HomeViewController
class ParentViewController: ButtonBarPagerTabStripViewController {

    let purpleInspireColor = UIColor(red:0.13, green:0.03, blue:0.25, alpha:1.0)
    
    override func viewDidLoad() {
        self.loadStyle()
        
        super.viewDidLoad()
        SwiftSpinner.useContainerView(self.view)

    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        SwiftSpinner.useContainerView(self.view)

    }
    
    func loadStyle(){
        // change selected bar color
        
        settings.style.buttonBarBackgroundColor = .white
        settings.style.buttonBarItemBackgroundColor = .white
        settings.style.selectedBarBackgroundColor = .blue
        settings.style.buttonBarItemFont = .boldSystemFont(ofSize: 15)
        settings.style.selectedBarHeight = 3.0
//        settings.style.buttonBarMinimumLineSpacing = 0
        settings.style.buttonBarItemTitleColor = .black
//        settings.style.buttonBarLeftContentInset = 0
//        settings.style.buttonBarRightContentInset = 0
        settings.style.buttonBarItemsShouldFillAvailableWidth = true
        changeCurrentIndexProgressive = { (oldCell: ButtonBarViewCell?, newCell: ButtonBarViewCell?, progressPercentage: CGFloat, changeCurrentIndex: Bool, animated: Bool) -> Void in
        guard changeCurrentIndex == true else { return }
        oldCell?.label.textColor = .gray
            newCell?.label.textColor = .blue
        }
    }
    
    
    override func viewControllers(for pagerTabStripController: PagerTabStripViewController) -> [UIViewController] {
        let world = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "world")
        let business = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "business")
        let politics = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "politics")
        let sports = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "sports")
        let technology = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "technology")
        let science = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "science")
        return [world, business, politics,sports,technology,science]
    }
    
}







