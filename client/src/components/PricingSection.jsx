import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, RPC_URL } from '../blockchain/config';
import { updateSubscription } from "../services/subscriptionService";

function PricingSection() {
  const handleBuyPlan = async (planIndex, priceEth, planName) => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

      // ✅ Lấy tất cả accounts từ Hardhat node
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        alert('❌ Không tìm thấy tài khoản Hardhat. Đảm bảo Hardhat node đang chạy!');
        return;
      }

      // ✅ Luôn dùng account#0 (giống như khi deploy)
      const signerAddress = accounts[0].address;
      const signer = await provider.getSigner(signerAddress);

      // Kiểm tra số dư account#0
      const balance = await provider.getBalance(signerAddress);
      const balanceInEth = parseFloat(ethers.formatEther(balance));
      const priceInEth = parseFloat(priceEth);

      if (balanceInEth < priceInEth) {
        alert(`❌ Số dư không đủ!\n\nAccount#0: ${signerAddress}\nCần: ${priceInEth} ETH\nHiện có: ${balanceInEth.toFixed(4)} ETH`);
        return;
      }

      // Xác nhận giao dịch
      const confirmPurchase = window.confirm(
        `🎬 Xác nhận mua gói ${planName}?\n\n` +
        `💰 Giá: ${priceEth} ETH\n` +
        `👛 Account#0: ${signerAddress.substring(0, 10)}...${signerAddress.substring(38)}\n` +
        `📊 Số dư hiện tại: ${balanceInEth.toFixed(4)} ETH\n` +
        `📉 Số dư sau giao dịch: ${(balanceInEth - priceInEth).toFixed(4)} ETH`
      );

      if (!confirmPurchase) {
        return;
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Thực hiện giao dịch
      console.log('🔄 Đang thực hiện giao dịch...');
      console.log('📍 Signer Address:', signerAddress);
      console.log('📦 Contract Address:', CONTRACT_ADDRESS);
      console.log('💵 Amount:', priceEth, 'ETH');
      
      const tx = await contract.buyPlan(planIndex, 1, {
        value: ethers.parseEther(priceEth),
      });
      
      console.log('⏳ Transaction hash:', tx.hash);
      console.log('⏳ Đang chờ xác nhận giao dịch...');
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

      // ✅ Cập nhật subscription với địa chỉ account#0
      console.log('📝 Cập nhật subscription trong database...');
      try {
        await updateSubscription(signerAddress);
        console.log('✅ Subscription updated successfully');
      } catch (apiError) {
        console.warn('⚠️ API update failed, but blockchain transaction succeeded:', apiError);
      }

      // ✅ Lưu walletAddress vào localStorage nếu chưa có
      const storedWallet = localStorage.getItem('walletAddress');
      if (!storedWallet || storedWallet !== signerAddress) {
        localStorage.setItem('walletAddress', signerAddress);
        
        // Cập nhật user object
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.walletAddress = signerAddress;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }

      // Trigger event để cập nhật balance ở Header
      window.dispatchEvent(new Event('updateEthBalance'));

      alert(`✅ Mua gói ${planName} thành công!\n\n🎉 Chúc bạn xem phim vui vẻ!`);
      
      // Reload trang sau 1 giây để cập nhật UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("❌ Lỗi mua gói:", error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert("❌ Số dư không đủ để thực hiện giao dịch!");
      } else if (error.code === 'ACTION_REJECTED') {
        alert("❌ Giao dịch bị từ chối!");
      } else if (error.message.includes('user rejected')) {
        alert("❌ Bạn đã hủy giao dịch!");
      } else if (error.message.includes('execution reverted')) {
        alert("❌ Smart contract từ chối giao dịch. Kiểm tra lại điều kiện mua gói!");
      } else {
        alert(`❌ Giao dịch thất bại!\n\n${error.message || 'Vui lòng kiểm tra console để xem chi tiết.'}`);
      }
    }
  };

  return (
    <section className="section section--border">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="section__title">Select your plan</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 order-md-2 order-lg-1">
            <div className="plan">
              <h3 className="plan__title">Basic</h3>
              <span className="plan__price">Free</span>
              <ul className="plan__list">
                <li className="plan__item"><i className="ti ti-circle-check"></i> 7 days</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> 720p Resolution</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> Limited Availability</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> Desktop Only</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> Limited Support</li>
              </ul>
              <Link to="/signup" className="plan__btn">Register</Link>
            </div>
          </div>

          <div className="col-12 col-md-12 col-lg-4 order-md-1 order-lg-2">
            <div className="plan plan--orange">
              <h3 className="plan__title">Premium</h3>
              <span className="plan__price">$34.99 <sub>/ month</sub></span>
              <ul className="plan__list">
                <li className="plan__item"><i className="ti ti-circle-check"></i> 1 Month</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Full HD</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Limited Availability</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> TV & Desktop</li>
                <li className="plan__item plan__item--none"><i className="ti ti-circle-minus"></i> 24/7 Support</li>
              </ul>
              <button
                className="plan__btn"
                type="button"
                onClick={() => handleBuyPlan(1, "0.03", "Premium")}
              >
                Choose Plan
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 order-md-3">
            <div className="plan plan--red">
              <h3 className="plan__title">Cinematic</h3>
              <span className="plan__price">$49.99 <sub>/ month</sub></span>
              <ul className="plan__list">
                <li className="plan__item"><i className="ti ti-circle-check"></i> 2 Months</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Ultra HD</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Limited Availability</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> Any Device</li>
                <li className="plan__item"><i className="ti ti-circle-check"></i> 24/7 Support</li>
              </ul>
              <button
                className="plan__btn"
                type="button"
                onClick={() => handleBuyPlan(2, "0.05", "Cinematic")}
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;