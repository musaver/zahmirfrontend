"use client";
import React, { useState, useEffect } from "react";

export default function ShareModal() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get current URL when component mounts
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Check out this amazing perfume from Zahmir Perfumes!')}`,
    instagram: '#', // Instagram doesn't support direct URL sharing
    tiktok: '#', // TikTok doesn't support direct URL sharing
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent('Amazing designer-inspired perfumes from Zahmir Perfumes')}`
  };

  return (
    <div
      className="modal modalCentered fade modalDemo tf-product-modal modal-part-content"
      id="share_social"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Share</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="overflow-y-auto">
            <ul className="tf-social-icon d-flex gap-10">
              <li>
                <a 
                  href={shareLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="box-icon social-facebook bg_line"
                >
                  <i className="icon icon-fb" />
                </a>
              </li>
              <li>
                <a 
                  href={shareLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="box-icon social-twiter bg_line"
                >
                  <i className="icon icon-Icon-x" />
                </a>
              </li>
              <li>
                <a 
                  href={shareLinks.instagram} 
                  className="box-icon social-instagram bg_line"
                  title="Share on Instagram (manual)"
                >
                  <i className="icon icon-instagram" />
                </a>
              </li>
              <li>
                <a 
                  href={shareLinks.tiktok} 
                  className="box-icon social-tiktok bg_line"
                  title="Share on TikTok (manual)"
                >
                  <i className="icon icon-tiktok" />
                </a>
              </li>
              <li>
                <a 
                  href={shareLinks.pinterest} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="box-icon social-pinterest bg_line"
                >
                  <i className="icon icon-pinterest-1" />
                </a>
              </li>
            </ul>
            
            <form
              onSubmit={(e) => e.preventDefault()}
              className="form-share"
              method="post"
              acceptCharset="utf-8"
            >
              <fieldset>
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  tabIndex={0}
                  aria-required="true"
                />
              </fieldset>
              <div className="button-submit">
                <button
                  className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                  type="button"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
