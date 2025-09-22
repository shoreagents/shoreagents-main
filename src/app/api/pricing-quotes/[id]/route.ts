import { NextRequest, NextResponse } from 'next/server'
import { PricingQuoteService } from '@/lib/pricingQuoteService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    const result = await PricingQuoteService.getQuoteById(id)
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 200 })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error in pricing quote API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    const result = await PricingQuoteService.deleteQuote(id)
    
    if (result.success) {
      return NextResponse.json({ message: 'Quote deleted successfully' }, { status: 200 })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in pricing quote API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
