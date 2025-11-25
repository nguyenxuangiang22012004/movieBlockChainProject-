import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../blockchain/config';
import { updateSubscription } from "../services/subscriptionService";
import { sendPaymentToAdmin, canAffordPlan, savePaymentTransaction } from "../services/paymentService";

function PricingSection() {
  const handleBuyPlan = async (planIndex, priceEth, planName) => {
    try {
      const priceInEth = parseFloat(priceEth);
      
      // ============================================
      // BƯỚC 1: Kiểm tra số dư
      // ============================================
      console.log('🔍 Checking balance...');
      const affordCheck = await canAffordPlan(priceInEth);
      
      if (!affordCheck.canAfford) {
        alert(
          `❌ Số dư không đủ!\n\n` +
          `💰 Cần: ${priceInEth} ETH\n` +
          `💰 Hiện có: ${affordCheck.currentBalance.toFixed(4)} ETH\n` +
          `📉 Thiếu: ${affordCheck.shortfall.toFixed(4)} ETH`
        );
        return;
      }

      // ============================================
      // BƯỚC 2: Xác nhận giao dịch với user
      // ============================================
      const confirmPurchase = window.confirm(
        `🎬 Xác nhận mua gói ${planName}?\n\n` +
        `💰 Giá: ${priceEth} ETH\n`   
      );

      if (!confirmPurchase) {
        return;
      }

      console.log('💳 Processing payment...');

      // ============================================
      // BƯỚC 3: Chuyển tiền cho admin (Account #1)
      // ============================================
      console.log('💰 Transferring payment to admin...');
      const paymentResult = await sendPaymentToAdmin(priceInEth, planName);
      
      console.log('✅ Payment successful!');
      console.log(`📝 Payment Transaction: ${paymentResult.transactionHash}`);
      console.log(`👨‍💼 Admin received: ${paymentResult.adminReceived} ETH`);
      console.log(`💰 Admin balance: ${paymentResult.adminBalanceBefore} ETH → ${paymentResult.adminBalanceAfter} ETH`);

      // ============================================
      // BƯỚC 4: Thực hiện giao dịch với smart contract
      // ============================================
      console.log('📜 Calling smart contract...');
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        throw new Error('Không tìm thấy tài khoản Hardhat');
      }

      const signerAddress = accounts[0].address;
      const signer = await provider.getSigner(signerAddress);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      console.log('🔄 Executing contract transaction...');
      const tx = await contract.buyPlan(planIndex, 1, {
        value: ethers.parseEther(priceEth),
      });
      
      console.log('⏳ Contract transaction hash:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Contract transaction confirmed in block:', receipt.blockNumber);

      // ============================================
      // BƯỚC 5: Lưu thông tin giao dịch thanh toán vào database
      // ============================================
      console.log('💾 Saving payment transaction to database...');
      try {
        await savePaymentTransaction({
          ...paymentResult,
          planName: planName,
          contractTransactionHash: tx.hash,
          metadata: {
            userBalanceBefore: paymentResult.userBalanceBefore,
            userBalanceAfter: paymentResult.userBalanceAfter,
            adminBalanceBefore: paymentResult.adminBalanceBefore,
            adminBalanceAfter: paymentResult.adminBalanceAfter,
            adminReceived: paymentResult.adminReceived
          }
        });
        console.log('✅ Payment transaction saved to database');
      } catch (dbError) {
        console.warn('⚠️ Failed to save payment transaction to database:', dbError);
        // Không dừng quá trình vì blockchain đã thành công
      }

      // ============================================
      // BƯỚC 6: Cập nhật subscription
      // ============================================
      console.log('📝 Updating subscription...');
      try {
        await updateSubscription(signerAddress);
        console.log('✅ Subscription updated successfully');
      } catch (apiError) {
        console.warn('⚠️ Subscription API update failed:', apiError);
        // Không dừng quá trình vì blockchain đã thành công
      }

      // ============================================
      // BƯỚC 7: Cập nhật localStorage
      // ============================================
      const storedWallet = localStorage.getItem('walletAddress');
      if (!storedWallet || storedWallet !== signerAddress) {
        localStorage.setItem('walletAddress', signerAddress);
        
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.walletAddress = signerAddress;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }

      // Trigger event để cập nhật balance ở Header
      window.dispatchEvent(new Event('updateEthBalance'));

      // ============================================
      // BƯỚC 8: Thông báo thành công
      // ============================================
      alert(
        `✅ Mua gói ${planName} thành công!\n\n` +
        `🎉 Chúc bạn xem phim vui vẻ!`
      );
      
      // Reload trang sau 1.5 giây để cập nhật UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("❌ Lỗi mua gói:", error);
      
      // Xử lý các loại lỗi cụ thể
      let errorMessage = "❌ Giao dịch thất bại!\n\n";
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage += "Số dư không đủ để thực hiện giao dịch!";
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage += "Giao dịch bị từ chối!";
      } else if (error.message?.includes('user rejected')) {
        errorMessage += "Bạn đã hủy giao dịch!";
      } else if (error.message?.includes('execution reverted')) {
        errorMessage += "Smart contract từ chối giao dịch. Kiểm tra lại điều kiện mua gói!";
      } else if (error.message?.includes('Số dư không đủ')) {
        errorMessage = error.message;
      } else {
        errorMessage += error.message || 'Vui lòng kiểm tra console để xem chi tiết.';
      }
      
      alert(errorMessage);
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