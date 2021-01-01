//
//  News.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/5/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//
import UIKit

class News {
    
    //MARK: Properties
    
    var title: String
    var img: String
    var date: String
    var category: String
    var url : String
    var articleid: String
    var description : String
    var favorite:Bool
    
    //MARK: Initialization
    
    init?(title: String, img: String, date: String, category: String, url:String, articleid: String, description: String) {
        // Initialize stored properties.
        self.title = title
        self.img = img
        self.date = date
        self.category = category
        self.url = url
        self.articleid = articleid
        self.description = description
        self.favorite = false
    }
    
    func setBookmark(tag:Bool){
        self.favorite = tag
    }
}
