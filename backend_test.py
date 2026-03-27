#!/usr/bin/env python3
"""
Backend API Testing for sendasdeltafimates Supabase Integration
Tests all endpoints to verify Supabase integration is working correctly
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://delta-forge-lab.preview.emergentagent.com/api"

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    print()

def test_root_endpoint():
    """Test GET /api/ - Root endpoint"""
    print("Testing Root Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            expected_fields = ['message', 'version', 'status']
            has_fields = all(field in data for field in expected_fields)
            
            if has_fields and data.get('message') == 'sendasdeltafimates API':
                print_test_result("Root endpoint", True, f"Status: {response.status_code}, Data: {data}")
                return True
            else:
                print_test_result("Root endpoint", False, f"Missing expected fields or incorrect message. Data: {data}")
                return False
        else:
            print_test_result("Root endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        print_test_result("Root endpoint", False, f"Exception: {str(e)}")
        return False

def test_products_list():
    """Test GET /api/products - List all products"""
    print("Testing Products List...")
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list) and len(data) > 0:
                # Check first product structure
                product = data[0]
                required_fields = ['id', 'name', 'description', 'price', 'category', 'stock']
                has_fields = all(field in product for field in required_fields)
                
                if has_fields:
                    print_test_result("Products list", True, f"Found {len(data)} products")
                    return True, data
                else:
                    print_test_result("Products list", False, f"Product missing required fields: {product}")
                    return False, None
            else:
                print_test_result("Products list", False, f"Expected list with products, got: {type(data)}")
                return False, None
        else:
            print_test_result("Products list", False, f"Status: {response.status_code}, Response: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Products list", False, f"Exception: {str(e)}")
        return False, None

def test_single_product():
    """Test GET /api/products/1 - Get single product"""
    print("Testing Single Product...")
    try:
        response = requests.get(f"{BASE_URL}/products/1", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['id', 'name', 'description', 'price', 'category', 'stock']
            has_fields = all(field in data for field in required_fields)
            
            if has_fields and data.get('id') == '1':
                print_test_result("Single product", True, f"Product: {data.get('name')}")
                return True
            else:
                print_test_result("Single product", False, f"Missing fields or wrong ID: {data}")
                return False
        else:
            print_test_result("Single product", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        print_test_result("Single product", False, f"Exception: {str(e)}")
        return False

def test_categories():
    """Test GET /api/categories - List categories"""
    print("Testing Categories...")
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list) and len(data) > 0:
                # Check if categories have name field
                category = data[0]
                if isinstance(category, dict) and 'name' in category:
                    print_test_result("Categories", True, f"Found {len(data)} categories: {[c['name'] for c in data]}")
                    return True
                else:
                    print_test_result("Categories", False, f"Category structure incorrect: {category}")
                    return False
            else:
                print_test_result("Categories", False, f"Expected list with categories, got: {type(data)}")
                return False
        else:
            print_test_result("Categories", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        print_test_result("Categories", False, f"Exception: {str(e)}")
        return False

def test_contact_creation():
    """Test POST /api/contacts - Create contact"""
    print("Testing Contact Creation...")
    try:
        contact_data = {
            "name": "Juan Pérez",
            "email": "juan.perez@example.com",
            "phone": "+54 9 381 564-2773",
            "reason": "Consulta sobre producto",
            "product": "Escultura Nebula",
            "message": "Hola, me interesa conocer más detalles sobre la Escultura Nebula. ¿Tienen stock disponible?"
        }
        
        response = requests.post(
            f"{BASE_URL}/contacts", 
            json=contact_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            required_fields = ['id', 'name', 'email', 'message', 'status', 'createdAt']
            has_fields = all(field in data for field in required_fields)
            
            if has_fields and data.get('email') == contact_data['email']:
                print_test_result("Contact creation", True, f"Contact ID: {data.get('id')}")
                return True
            else:
                print_test_result("Contact creation", False, f"Missing fields or data mismatch: {data}")
                return False
        else:
            print_test_result("Contact creation", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        print_test_result("Contact creation", False, f"Exception: {str(e)}")
        return False

def test_order_creation():
    """Test POST /api/orders - Create order"""
    print("Testing Order Creation...")
    try:
        order_data = {
            "items": [
                {
                    "productId": "1",
                    "name": "Escultura Nebula",
                    "price": 45000,
                    "quantity": 1
                },
                {
                    "productId": "2", 
                    "name": "Lámpara Helix",
                    "price": 28000,
                    "quantity": 2
                }
            ],
            "customer": {
                "name": "María González",
                "email": "maria.gonzalez@example.com",
                "phone": "+54 9 381 123-4567",
                "dni": "12345678"
            },
            "shipping": {
                "address": "Av. Libertador 1234",
                "city": "San Miguel de Tucumán",
                "province": "Tucumán",
                "postalCode": "4000"
            },
            "paymentMethod": "mercadopago"
        }
        
        response = requests.post(
            f"{BASE_URL}/orders",
            json=order_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            required_fields = ['id', 'items', 'customer', 'total', 'status', 'paymentStatus', 'createdAt']
            has_fields = all(field in data for field in required_fields)
            
            expected_total = 45000 + (28000 * 2)  # 101000
            
            if has_fields and data.get('total') == expected_total:
                print_test_result("Order creation", True, f"Order ID: {data.get('id')}, Total: ${data.get('total')}")
                return True, data.get('id')
            else:
                print_test_result("Order creation", False, f"Missing fields or incorrect total. Expected: {expected_total}, Got: {data}")
                return False, None
        else:
            print_test_result("Order creation", False, f"Status: {response.status_code}, Response: {response.text}")
            return False, None
            
    except Exception as e:
        print_test_result("Order creation", False, f"Exception: {str(e)}")
        return False, None

def test_mercadopago_preference():
    """Test POST /api/mercadopago/preference - Create payment preference"""
    print("Testing Mercado Pago Preference Creation...")
    try:
        preference_data = {
            "items": [
                {
                    "title": "Escultura Nebula",
                    "quantity": 1,
                    "unit_price": 45000
                },
                {
                    "title": "Lámpara Helix",
                    "quantity": 2,
                    "unit_price": 28000
                }
            ],
            "payer": {
                "name": "María",
                "surname": "González",
                "email": "maria.gonzalez@example.com"
            },
            "orderId": "test-order-123"
        }
        
        response = requests.post(
            f"{BASE_URL}/mercadopago/preference",
            json=preference_data,
            headers={'Content-Type': 'application/json'},
            timeout=15  # Longer timeout for external API
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['id', 'init_point']
            has_fields = all(field in data for field in required_fields)
            
            if has_fields:
                print_test_result("Mercado Pago preference", True, f"Preference ID: {data.get('id')}")
                return True
            else:
                print_test_result("Mercado Pago preference", False, f"Missing required fields: {data}")
                return False
        else:
            print_test_result("Mercado Pago preference", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        print_test_result("Mercado Pago preference", False, f"Exception: {str(e)}")
        return False

def test_admin_stats():
    """Test GET /api/admin/stats - Get admin dashboard stats"""
    print("Testing Admin Stats...")
    try:
        response = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['totalProducts', 'totalOrders', 'pendingOrders', 'totalRevenue', 'totalContacts', 'newContacts']
            has_fields = all(field in data for field in required_fields)
            
            if has_fields:
                print_test_result("Admin stats", True, f"Stats: {data}")
                return True
            else:
                print_test_result("Admin stats", False, f"Missing required fields: {data}")
                return False
        else:
            print_test_result("Admin stats", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        print_test_result("Admin stats", False, f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("=" * 60)
    print("BACKEND API TESTING - sendasdeltafimates E-commerce")
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print()
    
    results = []
    
    # Test 1: Root endpoint
    results.append(test_root_endpoint())
    
    # Test 2: Products list
    products_success, products_data = test_products_list()
    results.append(products_success)
    
    # Test 3: Single product
    results.append(test_single_product())
    
    # Test 4: Categories
    results.append(test_categories())
    
    # Test 5: Contact creation
    results.append(test_contact_creation())
    
    # Test 6: Order creation
    order_success, order_id = test_order_creation()
    results.append(order_success)
    
    # Test 7: Mercado Pago preference
    results.append(test_mercadopago_preference())
    
    # Test 8: Admin stats
    results.append(test_admin_stats())
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for r in results if r)
    total = len(results)
    
    print(f"Tests passed: {passed}/{total}")
    print(f"Success rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Backend APIs are working correctly.")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the details above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)