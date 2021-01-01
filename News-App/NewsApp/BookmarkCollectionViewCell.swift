//
//  BookmarkCollectionViewCell.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/7/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//

import UIKit
import Alamofire

class BookmarkCollectionViewCell: UICollectionViewCell {
    
    @IBOutlet weak var imgImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var categoryLabel: UILabel!
    
    @IBOutlet weak var bookmarkButton: UIButton!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    func fetchImage(imageURL: String?) {
        let url = imageURL!
        if url == "default-guardian" {
            self.imgImageView.image = UIImage(named: url)!
        } else {
            DispatchQueue.global(qos: .userInitiated).async {
                Alamofire.request(url).responseImage { response in
                    if let image = response.result.value {
                        DispatchQueue.main.async {
                            self.imgImageView.image = image
                        }
                    }
                }
            }
        }
        
    }
    
}
