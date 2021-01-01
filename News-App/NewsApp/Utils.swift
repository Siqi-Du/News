//
//  Utils.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/7/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//

import Foundation

class Utils {
    
    class func addBookmark(article_id:String){
        //        UserDefaults.standardUserDefaults().removeObjectForKey("username")
        print("addBookmark \(article_id) to favorites")
        var favorites = UserDefaults.standard.array(forKey: "favorites")
        print(favorites!)
        if favorites == nil {
            favorites = []
            favorites?.append(article_id)
        } else {
            if(favorites?.contains(where: { (value) -> Bool in
                return value as! String == article_id
            }) == false){
                favorites?.append(article_id)
            } else {
                
            }
            
        }
        
        UserDefaults.standard.set(favorites!, forKey: "favorites")
        print(UserDefaults.standard.array(forKey: "favorites")!)
    }
    
    class func removeBookmark(article_id:String){
        print("remove a favorites")
        print(UserDefaults.standard.array(forKey: "favorites")!)
        var favorites = UserDefaults.standard.array(forKey: "favorites")
        if favorites != nil {
//            print("favorite is not nil")
            for i in 0...favorites!.count-1{
//                print(i)
                //remove a bookmark
//                print(favorites![i] as! String)
                if favorites![i] as! String == article_id{
                    print("removed bookmark of article id\(article_id)")
                    favorites!.remove(at: i)
//                    print("removed bookmark of article id\(article_id)")
                    break
                }
            }
        } else{
             print("nothing to remove")
        }
        UserDefaults.standard.set(favorites, forKey: "favorites")
        print(UserDefaults.standard.array(forKey: "favorites")!)
    }
    
    //for favorite
    class func updateNews(news:[News]) -> [News]{
        var news = news
        var favorites = UserDefaults.standard.array(forKey: "favorites")!
        for i in 0...news.count{
            var article_id = news[i].articleid
            
            if(favorites.contains(where: { (value) -> Bool in
                return value as! String == article_id
            }) == false){
                print("favorites should noe contains bookmark,remove from self.news")
                news.remove(at: i)
                break
            }
        }
        return news
    }
    
    class func updateFavorites(news:[News]) -> [News]{
        var news = news
        var favorites = UserDefaults.standard.array(forKey: "favorites")!
        for i in 0...news.count-1{
            var article_id = news[i].articleid
            
            if(favorites.contains(where: { (value) -> Bool in
                return value as! String == article_id
            }) == false){
                print("favorites should noe contains bookmark,remove from self.news")
                news[i].favorite = false
            } else {
                news[i].favorite = true
            }
        }
        return news
    }
    
    class func isContained(articleId:String) -> Bool {
        var favorites = UserDefaults.standard.array(forKey: "favorites")!
        print(favorites)
        print(articleId)
        if(favorites.contains(where: { (value) -> Bool in
            return value as! String == articleId
        }) == false){
           return false
        } else {
            return true
        }
    }
    
    
}
