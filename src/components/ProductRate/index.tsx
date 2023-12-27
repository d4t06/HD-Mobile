import classNames from 'classnames/bind';
import styles from './ProductRate.module.scss';

const cx = classNames.bind(styles);

function ProductRate() {
   return (
      <div className={cx('col-full', 'product-rate')}>
               <div className={cx('rate-container')}>
                  <h1>Đánh giá</h1>
                  <div className={cx('rate-body')}>
                     <div className={cx('rate-left', 'col-5')}>
                        <div className={cx('header-box', 'rate-top')}>
                           <p className={cx('star', 'point')}>4.4</p>
                           <span>
                              <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                              <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                              <i className="fa-solid fa-star star black"></i>
                           </span>
                           <span className={cx('rate-count')}>49 đánh giá</span>
                        </div>
                        <ul className={cx('rating-list')}>
                           <li>
                              <div className={cx('number-star')}>
                                 <span className={cx('number')}>5</span>
                                 <span>
                                    <i className="fa-solid fa-star star"></i>
                                 </span>
                              </div>
                              <div className={cx('holderbar-star')}>
                                 <div className={cx('cur-bar')}></div>
                              </div>
                              <span className={cx('percent-star')}>49%</span>
                           </li>
                           <li>
                              <div className={cx('number-star')}>
                                 <span className={cx('number')}>4</span>
                                 <span>
                                    <i className="fa-solid fa-star star"></i>
                                 </span>
                              </div>
                              <div className={cx('holderbar-star')}>
                                 <div className={cx('cur-bar')}></div>
                              </div>
                              <span className={cx('percent-star')}>49%</span>
                           </li>
                           <li>
                              <div className={cx('number-star')}>
                                 <span className={cx('number')}>3</span>
                                 <span>
                                    <i className="fa-solid fa-star star"></i>
                                 </span>
                              </div>
                              <div className={cx('holderbar-star')}>
                                 <div className={cx('cur-bar')}></div>
                              </div>
                              <span className={cx('percent-star')}>49%</span>
                           </li>
                           <li>
                              <div className={cx('number-star')}>
                                 <span className={cx('number')}>2</span>
                                 <span>
                                    <i className="fa-solid fa-star star"></i>
                                 </span>
                              </div>
                              <div className={cx('holderbar-star')}>
                                 <div className={cx('cur-bar')}></div>
                              </div>
                              <span className={cx('percent-star')}>49%</span>
                           </li>
                           <li>
                              <div className={cx('number-star')}>
                                 <span className={cx('number')}>1</span>
                                 <span>
                                    <i className="fa-solid fa-star star"></i>
                                 </span>
                              </div>
                              <div className={cx('holderbar-star')}>
                                 <div className={cx('cur-bar')}></div>
                              </div>
                              <span className={cx('percent-star')}>49%</span>
                           </li>
                        </ul>
                     </div>
                     <div className={cx('rate-rigth', 'col-half')}>
                        <div className="row">
                           <div className={cx('col-full', 'rate-images')}>
                              <div className={cx('rate-image-frame')}>
                                 <img
                                    src="https://cdn.tgdd.vn/comment/52456871/received_440062338145774WW3X7.jpeg"
                                    alt=""
                                 />
                              </div>
                              <div className={cx('rate-image-frame')}>
                                 <img
                                    src="https://cdn.tgdd.vn/comment/52456871/received_440062338145774WW3X7.jpeg"
                                    alt=""
                                 />
                              </div>
                              <div className={cx('rate-image-frame')}>
                                 <img
                                    src="https://cdn.tgdd.vn/comment/52456871/received_440062338145774WW3X7.jpeg"
                                    alt=""
                                 />
                              </div>
                              <div className={cx('rate-image-frame')}>
                                 <img src="https://cdn.tgdd.vn/comment/53191068/20221129_185705GVIUK.jpg" alt="" />
                              </div>
                              <div className={cx('rate-image-frame')}>
                                 <img src="https://cdn.tgdd.vn/comment/51834367/20220617_0712040E81D.jpg" alt="" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className={cx('customer-comments')}>
                     <ul>
                        <li>
                           <div className={cx('comment-top')}>
                              <span className={cx('customer-name')}>Nguyễn Hữu Đạt</span>
                              <span className={cx('customer-buy')}>
                                 <i className="fa-solid fa-check"></i> Đã mua tại TGDĐ
                              </span>
                           </div>
                           <div className={cx('comment-body')}>
                              <span className={cx('customer-rate-star')}>
                                 <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                                 <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                                 <i className="fa-solid fa-star star"></i>
                              </span>
                              <p className={cx('customer-rate-content')}>Hài lòng !</p>
                              <div className={cx('customer-cta')}></div>
                           </div>
                        </li>
                        <li>
                           <div className={cx('comment-top')}>
                              <span className={cx('customer-name')}>Nguyễn Hữu Đạt</span>
                              <span className={cx('customer-buy')}>
                                 <i className="fa-solid fa-check"></i> Đã mua tại TGDĐ
                              </span>
                           </div>
                           <div className={cx('comment-body')}>
                              <span className={cx('customer-rate-star')}>
                                 <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                                 <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                                 <i className="fa-solid fa-star star"></i>
                              </span>
                              <p className={cx('customer-rate-content')}>Hài lòng !</p>
                              <div className={cx('customer-cta')}></div>
                           </div>
                        </li>
                        <li>
                           <div className={cx('comment-top')}>
                              <span className={cx('customer-name')}>Nguyễn Hữu Đạt</span>
                              <span className={cx('customer-buy')}>
                                 <i className="fa-solid fa-check"></i> Đã mua tại TGDĐ
                              </span>
                           </div>
                           <div className={cx('comment-body')}>
                              <span className={cx('customer-rate-star')}>
                                 <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                                 <i className="fa-solid fa-star star"></i> <i className="fa-solid fa-star star"></i>{' '}
                                 <i className="fa-solid fa-star star"></i>
                              </span>
                              <p className={cx('customer-rate-content')}>Hài lòng !</p>
                              {/* <div className={cx("customer-cta")}></div> */}
                           </div>
                        </li>
                        <li className={cx('comment-cta')}>
                           <button className={cx('write-comment')}>Viết đánh giá</button>
                           <button className={cx('see-more-comment')}>Xem thêm 77 đánh giá</button>
                        </li>
                     </ul>
                  </div>
               </div>
      </div>
   )
}

export default ProductRate